import datetime
import json
import os.path
from pathlib import Path

from django.core.files import File
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
    IsAuthenticated,
)
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from turiki_app.match_services import claim_match_result
from turiki_app.models import Team, Tournament, Chat, MapBan, Match, UserAccount, Notification
from turiki_app.permissons import IsAdminUserOrReadOnly, IsCaptainOfThisTeamOrAdmin
from turiki_app.serializers import (
    TournamentSerializer,
    MatchSerializer,
    TeamSerializer,
    ChatSerializer,
)
from turiki_app.services import TeamService, MatchService, TournamentService, UserService
from turiki_app.tasks import create_bracket, set_initial_matches, ban_map
from core.settings import MEDIA_ROOT
from PIL import Image


class UserAPIView(GenericViewSet):
    parser_classes = [MultiPartParser, JSONParser]

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated])
    def ongoing_match(self, request):
        user = request.user
        team = user.team

        active_statuses = ["ACTIVE", "RES_SEND_LOCKED", "BANS", "IN_GAME_LOBBY_CREATION", "CONTESTED"]

        ongoing_matches = Match.objects.filter(state__in=active_statuses)

        for match in ongoing_matches:
            tournament = match.tournament
            if tournament.players.filter(pk=user.id).count() == 1 and \
                    match.participants.filter(team__id=team.id).count() == 1:
                match_serializer: MatchSerializer = MatchSerializer(match)
                return Response(match_serializer.data)
            
        return Response(status=404)


    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated])
    def notifications(self, request):
        user = request.user
        unread_notifications = Notification.objects.filter(user__id=user.id, is_read=False).values()
        return Response(list(unread_notifications), status=200, content_type="application/json")

    @action(methods=["PATCH"], detail=False, permission_classes=[IsAuthenticated])
    def read_notification(self, request, pk=None):
        # {
        #     "id": -1
        # }
        notification_id = json.loads(request.body)["id"]
        notific: Notification = Notification.objects.get(pk=notification_id)
        notific.is_read = True
        notific.save()
        return Response(status=200)

    @action(methods=["PATCH"], detail=False, permission_classes=[IsAuthenticated])
    def credentials(self, request):
        return UserService.update_credentials(request)

    @action(methods=["PUT"], detail=False, permission_classes=[IsAuthenticated])
    def photo(self, request):
        user = request.user

        if 'image' not in request.FILES:
            return Response({"error": "No image attached"}, status=400)

        image_file = request.FILES['image']

        if not image_file.name.endswith('.png'):
            return Response({"error": "Only PNG images are allowed"}, status=415)

        try:
            image = Image.open(image_file)
        except Exception as e:
            return Response({"error": "Failed to process the image"}, status=500)

        # если размер изображения больше 1.5 мб, то оно не обрабатывается
        if image_file.size > 1.5 * 2 ** 20:
            return Response("image too large", status=400)

        old_img = user.image

        try:
            file_to_delete = Path(old_img)

            if file_to_delete.exists() and file_to_delete.is_file():
                file_to_delete.unlink()
                print(f"File '{old_img}' deleted successfully")
            else:
                print(f"File '{old_img}' does not exist")
        except TypeError:
            print("no image(")

        seconds = datetime.datetime.now().microsecond
        img_name = f'media/img/user{user.id}_{str(seconds)}.png'

        user.image = img_name

        image.save(MEDIA_ROOT + "/" + "/".join(img_name.split("/")[1:]))

        user.save()
        return Response(status=200)


class TournamentAPIView(ModelViewSet):
    queryset = Tournament.objects.prefetch_related(
        "matches", "matches__lobby", "matches__participants", "matches__participants__team",
        "matches__participants__team__tournaments",
        "matches__next_match",
        "players",
        "teams"
    )
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        try:
            request.data["reg_starts"] = datetime.datetime.fromisoformat(request.data["reg_starts"])
            request.data["starts"] = datetime.datetime.fromisoformat(request.data["starts"])
            tourn = TournamentService.create_tournament(**request.data)
            return Response(model_to_dict(tourn), 201)
        except serializers.ValidationError as e:
            raise e
        except Exception:
            return Response("something went wrong when creating the tournament", 400)

    @action(
        methods=["POST"],
        detail=True,
        permission_classes=[IsAdminUser],
    )
    def payment(self, request, pk=None):
        # {
        #     "team_id": 123,
        #     "is_confirmed": True
        # }
        try:
            tournament = self.get_object()

            team_id = request.data.get("team_id")
            is_confirmed = request.data.get("is_confirmed")

            team = Team.objects.get(pk=team_id)

            current_payment = team.payment

            current_payment[tournament.name] = {
                "id": tournament.id,
                "is_confirmed": is_confirmed
            }

            team.payment = current_payment

            team.save()

            return Response(team.payment, status=200)
        except:
            return Response(status=400)

    @action(
        methods=["POST", "PATCH", "DELETE"],
        detail=True,
        permission_classes=[IsAdminUser],
    )
    def register_team(self, request, pk=None):
        try:
            team = Team.objects.get(pk=request.data["team"]["team_id"])
        except:
            team = request.user.team
        tournament = self.get_object()

        if request.method == "POST":
            players_ids = request.data["team"]["players"]
            result = TournamentService.register_team(tournament, team, players_ids, "REGISTER")
        elif request.method == "DELETE":
            result = TournamentService.register_team(tournament, team, None, "CANCEL_REGISTRATION")
        elif request.method == "PATCH":
            players_ids = request.data["team"]["players"]
            result = TournamentService.register_team(tournament, team, players_ids, "CHANGE_PLAYERS")
        return Response(f"{result}")

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAdminUser])
    def status(self, request, pk=None):
        TournamentService.update_status(self.get_object(), request.data['status'])
        return Response(status=204)

    @action(methods=["POST"], detail=True, permission_classes=[IsAdminUser])
    def bracket(self, request, pk=None):
        tourn = self.get_object()
        create_bracket(tourn, tourn.max_rounds)
        return Response(status=201)

    @action(methods=["POST"], detail=True, permission_classes=[IsAdminUser])
    def initialize_matches(self, request, pk=None):
        tournament = self.get_object()

        if tournament.matches.filter(participants__isnull=False).count() > 0:
            return Response(status=400)

        set_initial_matches(tournament=tournament)
        return Response(status=201)


class MatchAPIView(ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]

    @action(methods=["PUT"], detail=True, permission_classes=[IsAuthenticated])
    def photo(self, request, pk=None):
        user = request.user

        match = self.get_object()

        if user.team_status != "CAPTAIN" or user.team.id != match.teams.first().id and user.team.id != match.teams.last().id:
            return Response(status=403)

        if 'image' not in request.FILES:
            return Response({"error": "No image attached"}, status=400)

        image_file = request.FILES['image']

        if not image_file.name.endswith('.png'):
            return Response({"error": "Only PNG images are allowed"}, status=415)

        try:
            image = Image.open(image_file)
        except Exception as e:
            return Response({"error": "Failed to process the image"}, status=500)

        if image_file.size > 1.5 * 2 ** 20:
            return Response("image too large", status=400)

        participant = match.participants.first() if match.participants.first().team.id == user.team.id else match.participants.last()

        old_img = participant.res_image

        try:
            file_to_delete = Path(old_img)

            if file_to_delete.exists() and file_to_delete.is_file():
                file_to_delete.unlink()
                print(f"File '{old_img}' deleted successfully")
            else:
                print(f"File '{old_img}' does not exist")
        except TypeError:
            print("no image(")

        img_name = f'media/img/team{user.team.id}_match{match.id}.png'

        participant.res_image = img_name

        image.save(MEDIA_ROOT + "/" + "/".join(img_name.split("/")[1:]))

        participant.save()
        return Response(status=200)

    def create(self, request, *args, **kwargs):
        return Response(status=404)

    @action(
        methods=["PUT"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def team_in_lobby(self, request, pk=None):
        return MatchService.team_enter_lobby(request, self.get_object())

    @action(
        methods=["POST", "PATCH", "PUT"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def ban(self, request, pk=None):
        try:
            team = request.user.team
            match = self.get_object()
            map_to_ban = request.data["map"]
            ban_map(match.id, team.id, map_to_ban, move=MapBan.DEFAULT_MAP_POOL_SIZE - len(match.bans.maps))
            return Response(f"{map_to_ban} successfully banned!", 200)
        except serializers.ValidationError as e:
            raise e
        except Exception:
            return Response(f"other errors", status=500)

    @action(
        methods=["PATCH"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def claim_result(self, request, pk=None):
        # try:
        match = self.get_object()
        team_id = request.user.team.id
        result = request.data["team"]["result"]
        if type(result) != bool:
            return Response("type of match result must be boolean", status=400)
        res = claim_match_result(match.id, team_id, result)
        if res is not None:
            return res
        return Response("Match result has been claimed")

    # except:
    #     return Response("data types mismatch", status=400)

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAdminUser])
    def force_status(self, request, pk=None):
        pass


class TeamAPIView(ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAuthenticated])
    def desc(self, request, pk=None):
        user: UserAccount = request.user
        team = self.get_object()
        if user.team_status != "CAPTAIN" or team.players.filter(id=user.id).count() < 1:
            return Response(status=403)

        team.description = request.data["description"]
        team.save()
        return Response(status=200)


    @action(methods=["PATCH"], detail=True, permission_classes=[IsAuthenticated])
    def join_confirm(self, request, pk=None):
        user: UserAccount = request.user
        team = self.get_object()
        if user.team_status != "CAPTAIN" or team.players.filter(id=user.id).count() < 1:
            return Response(status=403)

        team.is_join_confirmation_necessary = request.data["join_confirm"]
        team.save()

        return Response(status=200)


    @action(methods=["PATCH"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin])
    def openness(self, request, pk=None):
        try:
            team = self.get_object()
            is_open = request.data["is_open"]
            team.is_open = is_open
            team.save()
            return Response(status=204)
        except Exception:
            return Response(status=400)

    @action(methods=["PUT"], detail=True, permission_classes=[IsAuthenticated])
    def photo(self, request, pk=None):
        team = self.get_object()

        if request.user.team_status != "CAPTAIN" or request.user.team.id != team.id:
            return Response(status=403)

        if 'image' not in request.FILES:
            return Response({"error": "No image attached"}, status=400)

        image_file = request.FILES['image']

        if not image_file.name.endswith('.png'):
            return Response({"error": "Only PNG images are allowed"}, status=415)

        try:
            image = Image.open(image_file)
        except Exception as e:
            return Response({"error": "Failed to process the image"}, status=500)

        if image_file.size > 1.5 * 2 ** 20:
            return Response("image too large", status=400)

        old_img = team.image

        try:
            file_to_delete = Path(old_img)

            if file_to_delete.exists() and file_to_delete.is_file():
                file_to_delete.unlink()
                print(f"File '{old_img}' deleted successfully")
            else:
                print(f"File '{old_img}' does not exist")
        except TypeError:
            print("no image(")

        seconds = datetime.datetime.now().microsecond

        img_name = f'media/img/team{team.id}_{str(seconds)}.png'
        team.image = img_name

        image.save(MEDIA_ROOT + "/" + "/".join(img_name.split("/")[1:]))

        team.save()
        return Response(status=200)

    @action(methods=["PATCH"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin])
    def player_status(self, request, pk=None):
        pass

    @action(
        methods=["PATCH", "DELETE"], detail=True, permission_classes=[IsAuthenticated]
    )
    def apply_for_team(self, request, pk=None):
        team = self.get_object()
        res = None
        if request.method == "PATCH":
            res = TeamService.apply_for_team(team, request.user)
        elif request.method == "DELETE":
            res = TeamService.remove_from_team(team, request.user)
        if res is not None:
            return Response(res)
        return Response("Nothing seemed to happen")

    @action(
        methods=["PATCH", "DELETE"],
        detail=True,
        permission_classes=[IsAuthenticated],
    )
    def invite(self, request, pk=None):
        user = request.user
        team = self.get_object()

        if user.team.id != team.id or user.team_status != "CAPTAIN":
            return Response(status=403)

        player = UserAccount.objects.get(pk=request.data["player_id"])

        res = None
        if request.method == "PATCH":
            res = TeamService.invite_player(team, player)
        elif request.method == "DELETE":
            res = TeamService.remove_from_team(team, player)

        return Response(res)

    @action(
        methods=["PATCH", "PUT"],
        detail=True,
        permission_classes=[IsAuthenticated],
    )
    def change_name(self, request, pk=None):
        try:
            user = request.user
            team = self.get_object()

            if user.team_status != "CAPTAIN" or user.team.id != team.id:
                return Response(status=403)

            name = request.data.get("name", team.name)
            res = TeamService.change_team_name(team, name)
            return Response(res, 200)
        except:
            return Response(status=400)

    def create(self, request, *args, **kwargs):
        try:
            team = TeamService.create_team(user=request.user, name=request.data.pop("name"))
            return Response(model_to_dict(team), 201)
        except:
            return Response(status=400)

    @action(
        methods=["PATCH"],
        detail=True,
        permission_classes=[IsAuthenticated],
    )
    def captain(self, request, pk=None):
        old_cap = request.user

        team = self.get_object()

        if team.id != old_cap.team.id or old_cap.team_status != "CAPTAIN":
            return Response(status=400)

        new_cap_id = request.data.get("new_cap_id")

        new_cap = UserAccount.objects.get(pk=new_cap_id)

        old_cap.team_status = "ACTIVE"
        new_cap.team_status = "CAPTAIN"

        old_cap.save()
        new_cap.save()

        return Response(status=200)

    def update(self, request, *args, **kwargs):
        raise serializers.ValidationError("use other endpoints")


class ChatAPIView(ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        # TODO: сделать логику по аутентификации (вообще лучше сделать её в кастомном классе permission)
        # TODO: (чтобы читать могли только те, кто состоит в чате/матче/лобби вотевер + \админы)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        raise serializers.ValidationError("not allowed use websocket instead")

    def destroy(self, request, *args, **kwargs):
        raise serializers.ValidationError("nonononono, NO!")
        return super().destroy(request, *args, **kwargs)

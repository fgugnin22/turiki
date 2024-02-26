import datetime

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
from turiki_app.models import Team, Tournament, Chat, MapBan, Match, UserAccount
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

"""
View - представление, которое отвечает за обработку запросов(я хз как еще по другому объяснить)
в общем здесь в классах описаны методы(нередко скрытые наследованием), которые вызываются на тот или иной url
сюда приходят и здесь обрабатываются запросы из urls.py(где эти view зарегистрированы на соответствующие url)
"""


class UserAPIView(GenericViewSet):
    parser_classes = [MultiPartParser, JSONParser]

    @action(methods=["PATCH"], detail=False, permission_classes=[IsAuthenticated])
    def credentials(self, request):
        return UserService.update_credentials(request)

    @action(methods=["PUT"], detail=False, permission_classes=[IsAuthenticated])
    def photo(self, request):
        try:
            image = request.data.get("image").file
            user: UserAccount = request.user
            seconds = datetime.datetime.now().microsecond
            img_name = f'media/img/user{user.id}_{str(seconds)}.png'
            user.image = img_name
            file = File(image, name=img_name)  # TODO: this is not very safe
            if file.name[-4:] == ".png":
                with open(MEDIA_ROOT + f"/img/user{user.id}_{str(seconds)}.png", "wb+") as f:
                    f.writelines(file.readlines())
                user.save()
                return Response(status=200)
            else:
                return Response(status=415)
        except TypeError:
            return Response(status=400)


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
            # name, prize, max_rounds,  = (
            #     request.data.pop("name"),
            #     request.data.pop("prize"),
            #     request.data.pop("max_rounds"),
            # )

            # name = (
            #     name
            #     if name is not None
            #     else "You forgot to name the tournament dumbass"
            # )
            # prize = prize if prize is not None else "Prize too xd"
            # max_rounds = max_rounds if max_rounds is not None else 1000

            # tourn = TournamentService.create_tournament(name, prize, max_rounds)
            request.data["reg_starts"] = datetime.datetime.strptime(request.data["reg_starts"], "%Y-%m-%dT%H:%M:%S%z")
            request.data["starts"] = datetime.datetime.strptime(request.data["starts"], "%Y-%m-%dT%H:%M:%S%z")
            print(request.data["starts"])
            tourn = TournamentService.create_tournament(**request.data)
            return Response(model_to_dict(tourn), 201)
        except serializers.ValidationError as e:
            raise e
        except Exception:
            return Response("something went wrong when creating the tournament", 400)

    @action(
        methods=["POST", "PATCH", "DELETE"],
        detail=True,
        permission_classes=[IsCaptainOfThisTeamOrAdmin],
    )
    def register_team(self, request, pk=None):
        try:
            team = Team.objects.get(pk=request.data["team"]["team_id"])
        except:
            team = request.user.team
        tournament = self.get_object()

        if request.method == "POST":
            players_ids = request.data["team"]["players"]
            print(team, players_ids)
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
        set_initial_matches(tournament=self.get_object())
        return Response(status=201)


class MatchAPIView(ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]

    @action(methods=["PUT"], detail=True, permission_classes=[IsAuthenticated])
    def photo(self, request, pk=None):
        try:
            user = request.user
            match = self.get_object()
            if user.team_status != "CAPTAIN" or user.team.id != match.teams.first().id and user.team.id != match.teams.last().id:
                return Response(status=403)
            image = request.data.get("image").file
            img_name = f'media/img/team{user.team.id}_match{match.id}.png'
            participant = match.participants.first() if match.participants.first().team.id == user.team.id else match.participants.last()
            participant.res_image = img_name
            file = File(image, name=img_name)  # TODO: this is not very safe
            if file.name[-4:] == ".png":
                with open(MEDIA_ROOT + f"/img/team{user.team.id}_match{match.id}.png", "wb+") as f:
                    f.writelines(file.readlines())
                    f.close()
                participant.save()
                return Response(status=200)
            else:
                return Response(status=415)
        except TypeError:
            return Response(status=400)

    def create(self, request, *args, **kwargs):
        return Response(status=404)

    @action(
        methods=["PUT"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def team_in_lobby(self, request, pk=None):
        # {
        #     "team": {
        #         "team_id": int
        #     }
        # }
        return MatchService.team_enter_lobby(request, self.get_object())

    @action(
        methods=["POST", "PATCH", "PUT"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def ban(self, request, pk=None):
        # {
        #     "team": {
        #         "team_id": int
        #     },
        #     "map": str
        # }
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
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]

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
        try:
            image = request.data.get("image").file
            team = self.get_object()
            if request.user.team_status != "CAPTAIN" or request.user.team.id != team.id:
                return Response(status=403)
            img_name = f'media/img/team{team.id}.png'
            team.image = img_name
            file = File(image, name=img_name)  # TODO: this is not very safe
            if file.name[-4:] == ".png":
                with open(MEDIA_ROOT + f"/img/team{team.id}.png", "wb+") as f:
                    f.writelines(file.readlines())
                    f.close()
                team.save()
                return Response(status=200)
            else:
                return Response(status=415)
        except TypeError:
            return Response(status=400)

    @action(methods=["PATCH"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin])
    def player_status(self, request, pk=None):
        pass

    @action(
        methods=["PATCH", "DELETE"], detail=True, permission_classes=[IsAuthenticated]
    )
    def apply_for_team(self, request, pk=None):
        team = self.get_object()
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
        permission_classes=[IsCaptainOfThisTeamOrAdmin],
    )
    def invite(self, request, pk=None):
        team = self.get_object()
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
        permission_classes=[IsCaptainOfThisTeamOrAdmin],
    )
    def change_name(self, request, pk=None):
        try:
            team = self.get_object()
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

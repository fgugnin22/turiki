from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
    IsAuthenticated,
)
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from turiki.models import *
from turiki.permissons import IsAdminUserOrReadOnly, IsCaptainOfThisTeamOrAdmin
from turiki.serializers import (
    TournamentSerializer,
    MatchSerializer,
    TeamSerializer,
    ChatSerializer,
)
from turiki.services import TeamService, MatchService, TournamentService
from turiki.tasks import *

"""
View - представление, которое отвечает за обработку запросов(я хз как еще по другому объяснить)
в общем здесь в классах описаны методы(нередко скрытые наследованием), которые вызываются на тот или иной url
сюда приходят и здесь обрабатываются запросы из urls.py(где эти view зарегистрированы на соответствующие url)
"""


class TournamentAPIView(ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        try:
            name, prize, max_rounds = (
                request.data.pop("name"),
                request.data.pop("prize"),
                request.data.pop("max_rounds"),
            )

            name = (
                name
                if name is not None
                else "You forgot to name the tournament dumbass"
            )
            print(2)
            prize = prize if prize is not None else "Prize too xd"
            max_rounds = max_rounds if max_rounds is not None else 1000

            tourn = TournamentService.create_tournament(name, prize, max_rounds)
            return Response(model_to_dict(tourn), 201)
        except:
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
            result = TournamentService.register_team(tournament, team, players_ids, "REGISTER")
        elif request.method == "DELETE":
            result = TournamentService.register_team(tournament, team, None, "CANCEL_REGISTRATION")
        elif request.method == "PATCH":
            players_ids = request.data["team"]["players"]
            result = TournamentService.register_team(tournament, team, players_ids, "CHANGE_PLAYERS")
        return Response(f"{result}")

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAdminUser])
    def status(self, request, pk=None):
        # TODO: Заебать Андрея Ситникова
        pass

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

    def create(self, request, *args, **kwargs):
        return Response(status=404)

    @action(
        methods=["PATCH"], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin]
    )
    def claim_result(self, request, pk=None):
        try:
            match = self.get_object()
            team_id = request.user.team.id
            result = request.data["team"]["result"]
            if type(result) != bool:
                return Response("type of match result must be boolean", status=400)
            MatchService.claim_match_result(match, team_id, result)
            return Response("Match result has been claimed")
        except:
            return Response("data types mismatch", status=400)

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAdminUser])
    def force_status(self, request, pk=None):
        pass


class TeamAPIView(ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsCaptainOfThisTeamOrAdmin]

    @action(methods=["PATCH"], detail=True, permission_classes=[IsAuthenticated])
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
            name = request.data.pop("name")
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

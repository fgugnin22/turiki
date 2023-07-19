from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, IsAuthenticated
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
from turiki.services import register_team

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
        request.data["matches"] = []
        request.data["teams"] = []
        request.data["players"] = []
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(methods=['POST', 'PATCH', 'DELETE'], detail=True, permission_classes=[IsCaptainOfThisTeamOrAdmin])
    def register_team(self, request, pk=None):
        team = None
        try:
            team = Team.objects.get(pk=request.data["team"]["team_id"])
        except:
            team = request.user.team
        tournament = self.get_object()
        if request.method == "POST":
            players_ids = request.data["team"]["players"]
            result = register_team(tournament, team, players_ids, "REGISTER")
        elif request.method == "DELETE":
            result = register_team(tournament, team, None, "CANCEL_REGISTRATION")
        elif request.method == "PATCH":
            players_ids = request.data["team"]["players"]
            result = register_team(tournament, team, players_ids, "CHANGE_PLAYERS")
        return Response(f'{result}')

    @action(methods=['PATCH'], detail=True, permission_classes=[IsAdminUser])
    def status(self, request, pk=None):
        # TODO: Заебать Андрея Ситникова
        pass

    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     keys = request.data.keys()
    #     print(request.data['players'])
    #     if not ("teams" in keys):
    #         request.data["teams"] = []
    #     if not ("matches" in keys):
    #         request.data["matches"] = []
    #     if not ("status" in keys):
    #         request.data["status"] = instance.status
    #     if not ("players" in keys):
    #         request.data["players"] = []
    #     if (
    #             instance.status == "REGISTRATION_OPENED"
    #             and request.user.team_status == "CAPTAIN"
    #     ):
    #         register_team(instance, request.user.team, request.data["players"])
    #     serializer = self.serializer_class(instance, data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return Response(serializer.data)


class MatchAPIView(ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        pass

    @action(methods=['PATCH'], detail=True, permission_classes=[IsAuthenticated])
    def claim_result(self, request, pk=None):
        pass

    @action(methods=['PATCH'], detail=True, permission_classes=[IsAdminUser])
    def force_status(self, request, pk=None):
        pass
    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     user = request.user
    #     if check_captain(request.data, user):
    #         set_match_winner(instance, request.data)
    #         serializer = self.serializer_class(instance, data=request.data)
    #         serializer.is_valid(raise_exception=True)
    #         self.perform_update(serializer)
    #         return Response(serializer.data)
    #     return Response(status=status.HTTP_403_FORBIDDEN)


class TeamAPIView(ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(methods=['PATCH'], detail=True, permission_classes=[IsAuthenticated])
    def player_status(self, request, pk=None):
        pass

    @action(methods=['PATCH'], detail=True, permission_classes=[IsAuthenticated])
    def invite_player(self, request, pk=None):
        # Пример тела запроса
        # {
        #     "candidate": {
        #         "user_id": int,
        #         "has_captain_approval": bool,
        #         "has_own_approval": bool,
        #     }
        # }
        pass

    @action(methods=['PATCH, PUT'], detail=True, permission_classes=[IsAuthenticated])
    def name(self, request, pk=None):
        pass
    # def create(self, request, *args, **kwargs): TODO: этот метод скорее всего должен остаться
    #     request.data["next_member"] = request.user.name
    #     request.data["players"] = []
    #     print(request.data)
    #     serializer = self.serializer_class(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data)
    #
    # def update(self, request, *args, **kwargs):
    #     request.data["next_member"] = request.user.name
    #     instance = self.get_object()
    #     serializer = self.serializer_class(instance, data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #
    #     return Response(serializer.data)


class ChatAPIView(ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        # TODO: сделать логику по аутентификации (вообще лучше сделать её в кастомном классе permission)
        # TODO: (чтобы читать могли только те, кто состоит в чате/матче/лобби вотевер + \админы)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        raise serializers.ValidationError('not allowed use websocket instead')

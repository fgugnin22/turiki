from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from turiki.services import create_lobby
from turiki.models import *
from turiki.serializers import (
    TournamentSerializer,
    MatchSerializer,
    TeamSerializer,
    ChatSerializer,
)
from turiki.Permissons import IsAdminUserOrReadOnly
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from turiki.services import (
    check_captain,
    set_match_winner,
    create_message,
    register_team,
)


# Create your views here.
class TournamentAPIView(ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        request.data["matches"] = []
        request.data["teams"] = []
        print(request.data, request.user)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        keys = request.data.keys()
        if not ("teams" in keys):
            request.data["teams"] = []
        if not ("matches" in keys):
            request.data["matches"] = []
        if not ("status" in keys):
            request.data["status"] = instance.status
        if (
            instance.status == "REGISTRATION_OPENED"
            and request.user.team_status == "CAPTAIN"
        ):
            register_team(instance, request.user.team)
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class MatchAPIView(ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        pass

    def retrieve(self, request, *args, **kwargs):
        import datetime
        import calendar
        instance = self.get_object()
        print(calendar.timegm(instance.starts.timetuple()) <= calendar.timegm(datetime.datetime.utcnow().timetuple()))
        if calendar.timegm(instance.starts.timetuple()) <= calendar.timegm(datetime.datetime.utcnow().timetuple()):
            create_lobby(instance)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if check_captain(request.data, user):
            set_match_winner(instance, request.data)
            serializer = self.serializer_class(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)


class TeamAPIView(ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        request.data["next_member"] = request.user.name
        request.data["players"] = []
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        request.data["next_member"] = request.user.name
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ChatAPIView(ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def update(self, request, *args, **kwargs):
        request.data["messages"] = []
        user = request.user
        instance = self.get_object()
        msg = create_message(user, instance, request.data["content"])
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

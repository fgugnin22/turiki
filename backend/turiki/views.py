from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from turiki.models import *
from turiki.serializers import TournamentSerializer, MatchSerializer, TeamSerializer
from turiki.Permissons import IsAdminUserOrReadOnly
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly


# Create your views here.
class TournamentAPIView(ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class MatchAPIView(ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class TeamAPIView(ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [AllowAny]  # [IsAdminUserOrReadOnly]

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

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
        user_id = request.data["players"][0]["user_id"]
        if user_id != UserAccount.objects.get(name=request.user).id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

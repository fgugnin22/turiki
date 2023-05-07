from rest_framework.viewsets import ModelViewSet
from turiki.models import Tournament, Match, Team
from turiki.serializers import TournamentSerializer, MatchSerializer, TeamSerializer
from turiki.Permissons import IsAdminUserOrReadOnly
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
    permission_classes = [IsAuthenticatedOrReadOnly]  # [IsAdminUserOrReadOnly]

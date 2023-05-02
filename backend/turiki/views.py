from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from turiki.models import Tournament
from turiki.serializers import TournamentSerializer
from turiki.Permissons import IsAdminUserOrReadOnly


# Create your views here.
class TournamentAPIView(ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAdminUserOrReadOnly]

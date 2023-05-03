from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

from turiki.models import Tournament, Match, Team

User = get_user_model()


class UserCreateSerializer1(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        # СЮДА ДОБАВЛЯТЬ ПОЛЯ КОТОРЫЕ ПОТОМ ОТСЫЛАЕМ НА КЛИЕНТ
        fields = ('id', 'email', 'name', 'password', 'is_active')


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('name', 'prize', "registration_opened", "starts", "active", "played", "matches")


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ("teams", "is_active", "is_played", "starts", "tournament", "teams")


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"
        extra_fields = ["players", "matches"]

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .services import add_team_player, change_team_name, change_players_status, is_user_in_team
from turiki.models import *

User = get_user_model()


class UserCreateSerializer1(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        # СЮДА ДОБАВЛЯТЬ ПОЛЯ КОТОРЫЕ ПОТОМ ОТСЫЛАЕМ НА КЛИЕНТ
        fields = ('id', 'email', 'name', 'password', 'is_active', 'team', "is_captain")


class MatchSerializer(serializers.ModelSerializer):
    # participants = serializers.StringRelatedField(many=True)

    class Meta:
        depth = 2
        model = Match
        fields = ("id", "state", "round_text", "starts", "tournament", "participants", "next_match", "name")


class TournamentSerializer(serializers.ModelSerializer):
    teams = serializers.StringRelatedField(many=True)
    matches = MatchSerializer(many=True)

    class Meta:
        depth = 2
        model = Tournament
        fields = ('name', 'prize', "registration_opened", "starts", "active", "played", "matches", "teams")


class TeamSerializer(serializers.ModelSerializer):
    games = serializers.StringRelatedField(many=True, read_only=True)

    class PlayerSerializer(serializers.ModelSerializer):
        name = serializers.CharField()
        id = serializers.IntegerField(read_only=True)

        class Meta:
            model = User

            fields = ["team_status", "id", "name"]

    players = PlayerSerializer(many=True)

    class Meta:
        depth = 1
        model = Team
        fields = "__all__"

    def create(self, validated_data):
        validated_data.pop("players")
        user_name = validated_data.get("next_member")
        is_user_in_team(user_name)
        team = Team.objects.create(**validated_data)

        team = add_team_player(team, user_name, "CAPTAIN")

        return team

    def update(self, instance, validated_data):
        user_name = validated_data.get("next_member")
        players = validated_data.get("players")
        print(validated_data)
        team_name = validated_data.get("name")
        team = change_team_name(instance, user_name, team_name)
        team = add_team_player(team, user_name)
        team = change_players_status(team, players, user_name)
        team.save()
        return team

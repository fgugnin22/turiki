from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .services import add_team_player, change_team_name, change_players_status, is_user_in_team, create_bracket, \
    set_initial_matches, set_tournament_status
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
        depth = 1
        model = Match
        fields = ("id", "state", "round_text", "starts", "tournament", "participants", "next_match", "name")


class TournamentSerializer(serializers.ModelSerializer):
    teams = serializers.StringRelatedField(many=True)
    matches = MatchSerializer(many=True)

    class Meta:
        depth = 2
        model = Tournament
        fields = (
            'name', 'prize', "starts", "matches", "teams", "max_rounds", "status")

    def create(self, validated_data):
        validated_data.pop("matches")
        validated_data.pop("teams")
        rounds = validated_data.get("max_rounds", 1)
        tourn = Tournament.objects.create(**validated_data)
        tourn = create_bracket(tourn, rounds)
        return tourn

    def update(self, instance, validated_data):
        status = validated_data.pop("status")
        set_tournament_status(instance, status)
        if status == "REGISTRATION_CLOSED":
            set_initial_matches(instance)
        else:
            print(status)
        return instance


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

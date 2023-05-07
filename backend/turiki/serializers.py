from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

from turiki.models import Tournament, Match, Team

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


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "id", "is_captain"]


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    tournaments = TournamentSerializer(many=True, read_only=True)
    matches = MatchSerializer(many=True, read_only=True)

    def create(self, validated_data):
        data = dict(validated_data)
        captain = dict(data["players"][0])
        validated_data.pop("players")
        validated_data.pop("matches")
        validated_data.pop("tournaments")
        if User.objects.filter(name=captain["name"]).exists():
            if User.objects.get(name=captain["name"]).team is not None:
                raise ValueError('User already created a team')
            team = Team(**validated_data)
            captain = User.objects.get(name=captain["name"])
            captain.is_captain = True
            captain.save()
            team.save()
            team.players.set([captain])
            return team
        else:
            raise ValueError('USER DOES NOT EXIST')

    class Meta:
        depth = 1
        model = Team
        fields = ["players", "matches", "id", "name", "tournaments"]

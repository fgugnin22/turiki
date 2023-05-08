from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

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


class PlayerSerializer(serializers.ModelSerializer):
    team = serializers.StringRelatedField()
    user_id = serializers.IntegerField()
    # id = serializers.IntegerField()
    status = serializers.CharField(default='PENDING')

    class Meta:
        depth = 1
        model = Player
        fields = ["team", "user_id", "id", "status"]


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = Team
        fields = "__all__"
        extra_fields = ("players",)

    def create(self, validated_data):
        if len(validated_data.get("players")) > 1:
            raise ValueError("Access denied")
        captain_id = validated_data.pop("players")[0]["user_id"]

        captain = User.objects.get(pk=captain_id)
        teams = list(captain.teams.values())
        for x in teams:
            if x["status"] == "CAPTAIN" or x["status"] == "ACTIVE":
                raise ValueError("User is already in a team")
        team = Team.objects.create(**validated_data)
        player = Player.objects.create(team=team, user=captain, status="CAPTAIN")
        player.save()
        # team.players.set([captain])
        team.save()
        return team

    def update(self, instance, validated_data):
        new_player_id = validated_data.get("players")[0]["user_id"]
        user = User.objects.get(pk=new_player_id)
        players = instance.players
        for p in players.values():
            if p["user_id"] == new_player_id:
                raise ValueError("user is already in this team")
        new_player = Player.objects.create(user=user, team=instance, status="PENDING")

        players.add(new_player)
        new_player.save()
        instance.save()
        return instance

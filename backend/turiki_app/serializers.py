from datetime import datetime

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from turiki_app.models import *


User = get_user_model()


class UserSerializer(UserCreateSerializer):
    team_status = serializers.SlugField(read_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        # СЮДА ДОБАВЛЯТЬ ПОЛЯ КОТОРЫЕ ПОТОМ ОТСЫЛАЕМ НА КЛИЕНТ
        fields = (
            "id",
            "email",
            "name",
            "password",
            "is_active",
            "team",
            "team_status",
            "is_staff",
            "game_name",
            "image",
            "google_oauth2"
        )

    def update(self, instance, validated_data):
        return instance


class BansSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapBan
        fields = "__all__"


class LobbySerializer(serializers.ModelSerializer):
    chats = serializers.SerializerMethodField()
    
    def get_chats(self, obj):
        return obj.chats.values()

    class Meta:
        model = Lobby
        depth = 1
        fields = ("chats", "id")


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Participant
        fields = ("id", "is_winner", "result_text", "status", "team", "in_lobby", "res_image")


class MatchSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True)
    tournament = serializers.StringRelatedField()
    bans = BansSerializer()
    lobby = LobbySerializer(many=False)
    next_match = serializers.PrimaryKeyRelatedField(read_only=True)
    tournament = serializers.PrimaryKeyRelatedField(read_only=True)
    is_next_match_a_map = serializers.SerializerMethodField()

    def get_is_next_match_a_map(self, match):
        if match.is_bo3 and \
                (match.bo3_order == 0 or match.bo3_order == 1 and match.next_match is not None):
            return True

        return False


    class Meta:
        depth = 2
        model = Match
        fields = (
            "id",
            "state",
            "round_text",
            "starts",
            "tournament",
            "participants",
            "next_match",
            "name",
            "lobby",
            "bans",
            "started",
            "time_to_enter_lobby",
            "time_results_locked",
            "time_to_confirm_results",
            "first_result_claimed",
            "is_bo3",
            "is_visible",
            "bo3_order",
            "current_map",
            "is_next_match_a_map"
        )


class TeamSerializer(serializers.ModelSerializer):
    tournaments = serializers.StringRelatedField(many=True, read_only=True)

    class PlayerSerializer(serializers.ModelSerializer):
        name = serializers.CharField()
        id = serializers.IntegerField(read_only=True)
        game_name = serializers.CharField()
        image = serializers.CharField()

        class Meta:
            model = User
            fields = ["team_status", "id", "name", "game_name", "image", "email"]

    players = PlayerSerializer(many=True)

    class Meta:
        depth = 1
        model = Team
        fields = "__all__"
        extra_fields = ["id"]


class TournamentSerializer(serializers.ModelSerializer):
    class TournamentTeamSerializer(serializers.ModelSerializer):
        class Meta:
            depth = 1
            model = Team
            fields = ("id", "name", "image")

    class TournamentMatchSerializer(serializers.ModelSerializer):
        participants = ParticipantSerializer(many=True)
        next_match = serializers.PrimaryKeyRelatedField(read_only=True)
        class Meta:
            depth = 2
            model = Match
            fields = (
                "id",
                "state",
                "round_text",
                "starts",
                "participants",
                "next_match",
                "name",
                "is_last",
                "is_bo3",
                "is_visible",
                "bo3_order",
                "current_map",

            )

    class PlayerSerializer(serializers.ModelSerializer):
        name = serializers.CharField()
        id = serializers.IntegerField(read_only=True)

        class Meta:
            depth = 1
            model = User
            fields = ["team_id", "id", "name"]

    teams = TournamentTeamSerializer(many=True)
    matches = TournamentMatchSerializer(many=True)
    players = PlayerSerializer(many=True)

    class Meta:
        depth = 2
        model = Tournament
        fields = (
            "id",
            "name",
            "prize",
            "starts",
            "matches",
            "teams",
            "max_rounds",
            "status",
            "players",
            "time_to_check_in",
            "reg_starts",
            "max_players_in_team"
        )


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class MapBanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapBan
        fields = "__all__"

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)

    class Meta:
        model = Chat
        fields = "__all__"

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

from datetime import datetime

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from turiki_app.models import *

"""
В этом файле описывается как отсылаем на клиент и принимаем с клиента информацию о моделях из бд
вкратце о работе сериализаторов(конкретно про ModelSerializer(дальше - MS) т.к. он дает немного магии в виде простой 
работы с бд из коробки(CRUD), кастомизация с помощью переопределения методов create/update):

в *Meta* классе определяем модель с которой будет связан MS и поля которые отсылаются обратно в запрос на клиент

параметр *depth* отвечает за глубину сериализации вложенных объектов - тех моделей с которыми у данной есть отношения - 
many to many, many to one, one to one

если надо переопределить как сериализуются некоторые поля, то это делает с помощью переопределения этих полей в классе
нужного сериализатора 
"""

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
            "image"
        )

    def update(self, instance, validated_data):
        # password = validated_data.pop("password")
        # validated_data["password"] = instance.password
        # if password is not None:
        #     instance.set_password(password) TODO: umm uhh ,n vm guys
        # super().update(instance, validated_data)
        # instance.save()
        return instance


class BansSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapBan
        fields = "__all__"


class LobbySerializer(serializers.ModelSerializer):
    chat = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Lobby
        depth = 1
        fields = ("chat", "id")


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
            "first_result_claimed"
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
            fields = ["team_status", "id", "name", "game_name", "image"]

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

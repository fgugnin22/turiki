from datetime import datetime

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .services import add_team_player, change_team_name, change_players_status, is_user_in_team, end_match, \
    register_team
from .tasks import create_lobby, set_tournament_status, set_initial_matches, create_bracket
from turiki.models import *
from .tasks import exec_task_on_date

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
    class Meta(UserCreateSerializer.Meta):
        model = User
        # СЮДА ДОБАВЛЯТЬ ПОЛЯ КОТОРЫЕ ПОТОМ ОТСЫЛАЕМ НА КЛИЕНТ
        fields = ('id', 'email', 'name', 'password', 'is_active', 'team', 'team_status')


class MatchSerializer(serializers.ModelSerializer):
    # participants = serializers.StringRelatedField(many=True)
    tournament = serializers.StringRelatedField()

    class Meta:
        depth = 2
        model = Match
        fields = ("id", "state", "round_text", "starts", "tournament", "participants", "next_match", "name", "lobby")

    def update(self, instance, validated_data):
        # set_match_winner(instance)
        create_lobby(instance)
        end_match(instance)
        return instance

    def create(self, validated_data):
        pass


class TeamSerializer(serializers.ModelSerializer):
    games = serializers.StringRelatedField(many=True, read_only=True)
    tournaments = serializers.StringRelatedField(many=True, read_only=True)

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
        extra_fields = ["id"]

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
        team_name = validated_data.get("name")
        team = change_team_name(instance, user_name, team_name)
        if len(players) == 1 and players[0]["team_status"] == "PENDING":
            team = add_team_player(team, user_name)
        team = change_players_status(team, players, user_name)
        team.save()
        return team


class TournamentSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)
    matches = MatchSerializer(many=True)

    class PlayerSerializer(serializers.ModelSerializer):
        name = serializers.CharField()
        id = serializers.IntegerField(read_only=True)

        class Meta:
            depth = 1
            model = User
            fields = ["team_id", "id", "name"]

    players = PlayerSerializer(many=True)

    class Meta:
        depth = 2
        model = Tournament
        fields = (
            'id', 'name', 'prize', "starts", "matches", "teams", "max_rounds", "status", "players")

    def create(self, validated_data):
        validated_data.pop("matches")
        validated_data.pop("teams")
        validated_data.pop("players")
        rounds = validated_data.get("max_rounds", 1)
        tourn = Tournament.objects.create(**validated_data)
        tourn = create_bracket(tourn, rounds)
        return tourn

    def update(self, instance, validated_data):
        status = validated_data.pop("status")
        when_to_update = instance.starts if instance.status in ["REGISTRATION_CLOSED"] else datetime.now()
        exec_task_on_date(set_tournament_status, [instance, status], when_to_update)
        set_tournament_status(instance, status)
        if status == "REGISTRATION_CLOSED" and len(instance.matches.values()) == 0:
            instance = create_bracket(instance, instance.max_rounds)
            set_initial_matches(instance)
        else:
            print(status)
        return instance


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
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

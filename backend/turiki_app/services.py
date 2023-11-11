from datetime import timedelta, datetime

import dramatiq
from channels.db import database_sync_to_async
import jwt
from rest_framework.response import Response

from .models import Tournament, Team, MapBan, Match, Participant, UserAccount, Lobby, Chat, Message
from rest_framework import serializers
from turiki_app.tasks import set_match_start_bans, set_match_active
import pytz

utc = pytz.UTC
"""
В этот файл я попытался частично вынести более сложную логику по работе с бд и некоторые функции хелперы
"""


class TournamentService:
    @staticmethod
    def create_tournament(
            name, prize, max_rounds, starts=datetime.now() + timedelta(hours=3)
    ):
        try:
            tourn = Tournament.objects.create(
                name=name, prize=prize, max_rounds=max_rounds, starts=starts
            )
            return tourn
        except:
            return "wtf tournament no good wehn creating"

    @staticmethod
    def register_team(tournament, team, players_ids, action):
        """
        Регистрация команды вместе с игроками
        """
        if tournament.status != "REGISTRATION_OPENED":
            raise serializers.ValidationError("registration cancelled")
        if action == "REGISTER":
            teams = map(lambda x: x["id"], list(tournament.teams.values()))
            if team.id in teams:
                raise serializers.ValidationError("already registered")
            if len(tournament.teams.values()) >= 2 ** tournament.max_rounds:
                raise serializers.ValidationError("tournament max teams count reached")
            tournament.teams.add(team)
            for i, player_id in enumerate(players_ids):
                try:
                    user_obj = UserAccount.objects.get(pk=player_id)
                    if user_obj.team.id == team.id and (
                            user_obj.team_status != "REJECTED"
                            or user_obj.team_status != "PENDING"
                    ):
                        tournament.players.add(user_obj)
                        print("added player")
                except:
                    print(
                        "something went wrong when adding player to tournament",
                        player_id,
                        user_obj,
                    )
            tournament.save()
            return "team registered successfully"
        elif action == "CANCEL_REGISTRATION":
            teams = map(lambda x: x["id"], list(tournament.teams.values()))
            tourn_players = list(
                map(lambda x: x["id"], list(tournament.players.values()))
            )
            tournament.teams.remove(team)
            is_team_in_tournament = team.id in teams
            if not is_team_in_tournament:
                return "registration changing cancelled"
            for i, player_id in enumerate(tourn_players):
                try:
                    user_obj = UserAccount.objects.get(pk=player_id)
                    if user_obj.team.id == team.id and (
                            user_obj.team_status != "REJECTED"
                            or user_obj.team_status != "PENDING"
                    ):
                        tournament.players.remove(user_obj)
                        print("removed player")
                except:
                    pass
            tournament.save()
            return "team unregistered successfully"
        elif action == "CHANGE_PLAYERS":
            teams = map(lambda x: x["id"], list(tournament.teams.values()))
            if team.id not in teams:
                return "registration changing cancelled"
            new_players = []
            for i, player_id in enumerate(players_ids):
                try:
                    user_obj = UserAccount.objects.get(pk=player_id)
                    if user_obj.team.id == team.id and (
                            user_obj.team_status != "REJECTED"
                            or user_obj.team_status != "PENDING"
                    ):
                        new_players.append(user_obj)
                except:
                    pass
            tournament.players.set(new_players)
            tournament.save()
            return "players changed successfully"


class MatchService:
    @staticmethod
    def submit_results(request, match):
        user = request.user
        p1 = match.teams.first()
        p2 = match.teams.last()
        self_participant = p1 if p1.team.id == user.team.id else p2 if p2.team.id == user.team.id else None
        if self_participant is None:
            return Response(status=403)

    @staticmethod
    def team_enter_lobby(request, match):
        can_confirm_team_in_lobby = match.started is not None and match.started + match.time_to_enter_lobby >= datetime.now(
            tz=pytz.timezone('Europe/Moscow'))
        if can_confirm_team_in_lobby:
            user = request.user
            [p1, p2] = list(match.participants.values())
            p1 = Participant.objects.get(pk=p1["id"])
            p2 = Participant.objects.get(pk=p2["id"])
            participant_in_question = p1 if p1.team.id == user.team.id else p2
            participant_in_question.in_lobby = True
            participant_in_question.save()
            if p1.in_lobby and p2.in_lobby:
                if match.state == "IN_GAME_LOBBY_CREATION":
                    match.state = "RES_SEND_LOCKED"
                    match.started = datetime.now(tz=pytz.timezone('Europe/Moscow'))
                    match.save()
            return Response(status=200)
        return Response(status=400)


class UserService:
    @staticmethod
    def update_credentials(request):
        new_password = request.data.get("new_password")
        old_password = request.data.get("old_password")
        new_email = request.data.get("email")
        new_name = request.data.get('name')
        new_game_name = request.data.get('game_name')
        user = request.user
        if user.name is None or len(user.name) == 0:
            user.google_oauth2 = True
            user.name = new_name
            if new_password is not None and len(new_password) > 7:
                user.set_password(new_password)
                user.google_oauth2 = False
            if new_email is not None:
                user.email = new_email
            if new_game_name is not None:
                user.game_name = new_game_name
            user.save()
            print(user.name, user.email)
            return Response("credentials updated successfully", 200)
        elif user.check_password(old_password):
            if new_password is not None and len(new_password) > 7:
                user.set_password(new_password)
            if new_email is not None:
                user.email = new_email
            if new_name is not None:
                user.name = new_name
            if new_game_name is not None:
                user.game_name = new_game_name
            user.save()
            print(user.name, user.email)
            return Response("credentials updated successfully", 200)
        return Response("very bad response", 400)


class TeamService:
    @staticmethod
    def create_team(user, name):
        if user.team is not None:
            raise serializers.ValidationError("user already in a team")
        team = Team.objects.create(name=name)
        team.players.add(user)
        user.team = team
        user.team_status = "CAPTAIN"
        user.save()
        return team

    @staticmethod
    def is_user_in_team(user_name):
        # состоит ли user с именем user_name в КАКОЙ-ЛИБО команде
        user = UserAccount.objects.get(name=user_name)
        if user.team_status is not None and user.team_status != "REJECTED":
            print(user.team_status is None)
            raise serializers.ValidationError("User is already in a team")

    @staticmethod
    def change_team_name(team, team_name):
        team.name = team_name
        team.save()
        return "team name changed successfully"

    @staticmethod
    def remove_from_team(team, player):
        try:
            if team.players.count() == 1:
                team.delete()
            player.team = None
            player.team_status = None
            player.save()
            if player.name == team.next_member:
                team.next_member = None
                team.save()
            team.players.remove(player)
            return "player kicked from team"
        except:
            return "None"

    @staticmethod
    def apply_for_team(team, player):
        team_players_ids = map(lambda x: x["id"], list(team.players.values()))
        if player.id in team_players_ids:
            return "player already applied for this team"
        if team.next_member == player.name:
            player.team_status = "ACTIVE"
            res = "player added to the team"
        else:
            player.team_status = "PENDING"
            res = "successfully applied for team"
        player.team = team
        team.players.add(player)
        player.save()
        return res

    @staticmethod
    def invite_player(team, player):
        if (
                player.team is not None
                and player.team.id == team.id
                and player.team_status == "PENDING"
        ):
            team.players.add(player)
            player.team_status = "ACTIVE"
            player.save()
            return "player added to the team"
        team.next_member = player.name
        team.save()
        return "player was invited to the team"

    @staticmethod
    def add_team_player(team, user_name, status="PENDING"):
        # добавляет user с именем user_name в команду, team - объект класса Team (models.py)
        player = UserAccount.objects.get(name=user_name)
        if TeamService.is_user_in_team(user_name):
            return team
        player.team_status = status
        team.players.add(player)
        player.save()
        return team


@database_sync_to_async
def async_return_user(token):
    # асинхронное доставание UserAccount по jwt токену из БД для consumers.py -> websocket
    from core.settings import SECRET_KEY

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = UserAccount.objects.get(pk=user_id)
    except:
        user = None
    return user


@database_sync_to_async
def async_create_message(user, chat_id, content):
    # асинхронная почти что копия create_message для consumers.py
    chat = Chat.objects.get(pk=chat_id)
    if len(content) == 0:
        raise serializers.ValidationError("Content must not be an empty string")
    chat.save()
    return Message.objects.create(user=user, chat=chat, content=content,
                                  created_at=datetime.now(tz=pytz.timezone('Europe/Moscow')))

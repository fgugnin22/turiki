from datetime import timedelta, datetime
from channels.db import database_sync_to_async
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import serializers
import pytz
import jwt

from turiki_app.tasks import exec_task_on_date, set_tournament_status, set_match_state
from turiki_app.models import Tournament, Team, Participant, UserAccount, Chat, Message

utc = pytz.UTC
"""
В этот файл я попытался частично вынести более сложную логику по работе с бд и некоторые функции хелперы
"""


class TournamentService:
    @staticmethod
    def create_tournament(
            name=None, prize=None, max_players_in_team=None,
            max_rounds=None, reg_starts=None, time_to_check_in=None, time_to_enter_lobby=None, time_results_locked=None,
            time_to_confirm_results=None, time_to_select_map=None, starts=datetime.now() + timedelta(hours=3),
    ):
        try:
            if name is None or \
                    prize is None or \
                    max_rounds is None or \
                    reg_starts is None or \
                    time_to_check_in is None or \
                    time_to_enter_lobby is None or \
                    time_results_locked is None or \
                    time_to_confirm_results is None or \
                    time_to_select_map is None or \
                    max_players_in_team is None or \
                    starts is None:
                raise serializers.ValidationError("Forgot all or some of parameters")

            tourn: Tournament = Tournament.objects.create(
                name=name, prize=prize, max_rounds=max_rounds, starts=starts, reg_starts=reg_starts,
                time_to_check_in=time_to_check_in,
                time_to_enter_lobby=time_to_enter_lobby,
                time_results_locked=time_results_locked,
                time_to_confirm_results=time_to_confirm_results,
                time_to_select_map=time_to_select_map,
                max_players_in_team=max_players_in_team
            )
            exec_task_on_date(set_tournament_status, [tourn.id, Tournament.allowed_statuses[1]], tourn.reg_starts)
            return tourn
        except serializers.ValidationError as e:
            raise e
        except Exception:
            return "wtf tournament no good wehn creating"

    @staticmethod
    def update_status(tournament: Tournament, status):
        if status in tournament.allowed_statuses:
            if status == tournament.allowed_statuses[3]:
                tournament.status = status
                exec_task_on_date(set_tournament_status, [tournament.id, tournament.allowed_statuses[4]],
                                  when=now() + tournament.time_to_check_in)
                tournament.save()
                return
            if status in tournament.allowed_statuses[1:3]:
                tournament.status = status
                tournament.save()
                return
            raise serializers.ValidationError(f'Unsupported/Wrong Status: `{status}`')

    @staticmethod
    def register_team(tournament: Tournament, team, players_ids, action):
        if tournament.status != tournament.allowed_statuses[1] and tournament.status != tournament.allowed_statuses[3]:
            raise serializers.ValidationError("registration cancelled")
        if tournament.status == tournament.allowed_statuses[3]:
            if action == "CHANGE_PLAYERS":
                teams = map(lambda x: x["id"], list(tournament.teams.values()))
                if team.id not in teams:
                    return "registration changing cancelled"
                new_players = []
                is_captain_in = False
                for i, player_id in enumerate(players_ids):
                    try:
                        user_obj = UserAccount.objects.get(pk=player_id)
                        if user_obj.team.id == team.id and (
                                user_obj.team_status != "REJECTED"
                                or user_obj.team_status != "PENDING"
                        ):
                            if user_obj.team_status == "CAPTAIN":
                                is_captain_in = True
                            new_players.append(user_obj)
                    except:
                        raise serializers.ValidationError('code bruh-1')
                if not is_captain_in:
                    raise serializers.ValidationError('Капитан обязан участвовать')
                for player in tournament.players.all():
                    if player.team.id == team.id:
                        tournament.players.remove(player)
                for new_plr in new_players:
                    tournament.players.add(new_plr)
                tournament.save()
                return "players changed successfully"
            else:
                raise serializers.ValidationError('code bruh-2')

        if action == "REGISTER":
            teams = map(lambda x: x["id"], list(tournament.teams.values()))
            if team.id in teams:
                raise serializers.ValidationError("already registered")
            if len(tournament.teams.values()) >= 2 ** tournament.max_rounds:
                raise serializers.ValidationError("tournament max teams count reached")
            new_players = []
            is_captain_in = False
            for i, player_id in enumerate(players_ids):
                try:
                    user_obj = UserAccount.objects.get(pk=player_id)
                    if user_obj.team.id == team.id and (
                            user_obj.team_status != "REJECTED"
                            or user_obj.team_status != "PENDING"
                    ):
                        if user_obj.team_status == "CAPTAIN":
                            is_captain_in = True
                        new_players.append(user_obj)
                except:
                    raise serializers.ValidationError('code bruh-1')
            if not is_captain_in:
                raise serializers.ValidationError('Капитан обязан участвовать')
            tournament.teams.add(team)
            for new_plr in new_players:
                tournament.players.add(new_plr)
            tournament.save()

            return "team registered successfully"
        elif action == "CANCEL_REGISTRATION":
            teams = map(lambda x: x["id"], list(tournament.teams.values()))
            tourn_players = list(
                map(lambda x: x["id"], list(tournament.players.values()))
            )
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
            tournament.teams.remove(team)
            tournament.save()
            return "team unregistered successfully"


class MatchService:
    @staticmethod
    def team_enter_lobby(request, match):
        user = request.user
        [p1, p2] = list(match.participants.values())
        p1: Participant = Participant.objects.get(pk=p1["id"])
        p2: Participant = Participant.objects.get(pk=p2["id"])
        can_confirm_team_in_lobby = match.state == "IN_GAME_LOBBY_CREATION"
        from .match_services import notify

        if can_confirm_team_in_lobby:
            participant_in_question = p1 if p1.team.id == user.team.id else p2
            if not participant_in_question.in_lobby:
                notify(match, f"Команда {participant_in_question.team.name} в лобби!")
            participant_in_question.in_lobby = True
            participant_in_question.save()

            if p1.in_lobby and p2.in_lobby:
                if match.state == "IN_GAME_LOBBY_CREATION":
                    match.state = "RES_SEND_LOCKED"
                    match.started = datetime.now(tz=pytz.timezone('Europe/Moscow'))
                    match.save()
                    exec_task_on_date(set_match_state, [match.id, "ACTIVE"], match.started + match.time_results_locked)
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
        if new_password is None or len(new_password) == 0:
            if new_email is not None:
                user.email = new_email
            if new_name is not None:
                user.name = new_name
            if new_game_name is not None:
                user.game_name = new_game_name
            user.save()
            return Response("credentials updated successfully", 200)
        if user.name is None or len(user.name) == 0 or user.google_oauth2:
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
    def change_team_name(team, team_name):
        team.name = team_name
        team.save()
        return "team name changed successfully"

    @staticmethod
    def remove_from_team(team: Team, player):
        try:
            if player.name == team.next_member:
                team.next_member = None

            if player.team_status == "CAPTAIN":
                for plr in team.players.all():
                    if plr.team_status == "ACTIVE":
                        plr.team_status = "CAPTAIN"
                        plr.save()
                        break

            player.team = None
            player.team_status = None
            player.save()

            team.save()
            team.refresh_from_db()

            if team.players.count() == 0:
                team.delete()
                return

            team.save()
            return "player kicked from team"
        except:
            return "None"

    @staticmethod
    def apply_for_team(team, player):
        if not team.is_open:
            return "team is closed for applications"
        team_players_ids = map(lambda x: x["id"], list(team.players.values()))
        if player.id in team_players_ids:
            return "player already applied for this team"
        if team.next_member == player.name or not team.is_join_confirmation_necessary:
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


@database_sync_to_async
def async_return_chat(id):
    return Chat.objects.get(pk=id)


@database_sync_to_async
def async_validate_chat_connection(chat, user):
    return not user.is_staff and chat.team is not None and user.team.id != chat.team.id or user.team_status not in ["ACTIVE", "CAPTAIN"]


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
    chat = Chat.objects.get(pk=chat_id)
    if len(content) == 0:
        raise serializers.ValidationError("Content must not be an empty string")
    chat.save()
    return Message.objects.create(user=user, chat=chat, content=content,
                                  created_at=datetime.now(tz=pytz.timezone('Europe/Moscow')))

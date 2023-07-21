from channels.db import database_sync_to_async
import jwt
from .tasks import *
from rest_framework import serializers

"""
В этот файл я попытался частично вынести более сложную логику по работе с бд и некоторые функции хелперы
"""


def register_team(tournament, team, players_ids, action):
    """
    Регистрация команды вместе с игроками
    """
    if tournament.status != "REGISTRATION_OPENED":
        return "operation cancelled"
    if action == "REGISTER":
        teams = map(lambda x: x["id"], list(tournament.teams.values()))
        if team.id in teams:
            return "registration cancelled"
        tournament.teams.add(team)
        for i, player_id in enumerate(players_ids):
            try:
                user_obj = UserAccount.objects.get(pk=player_id)
                if user_obj.team.id == team.id and (
                        user_obj.team_status != "REJECTED" or user_obj.team_status != "PENDING"):
                    tournament.players.add(user_obj)
                    print("added player")
            except:
                print("something went wrong when adding player to tournament", player_id, user_obj)
        tournament.save()
        return "team registered successfully"
    elif action == "CANCEL_REGISTRATION":
        teams = map(lambda x: x["id"], list(tournament.teams.values()))
        tourn_players = list(map(lambda x: x["id"], list(tournament.players.values())))
        tournament.teams.remove(team)
        if team.id not in teams:
            return "registration changing cancelled"
        for i, player_id in enumerate(tourn_players):
            try:
                user_obj = UserAccount.objects.get(pk=player_id)
                if user_obj.team.id == team.id and (
                        user_obj.team_status != "REJECTED" or user_obj.team_status != "PENDING"):
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
                        user_obj.team_status != "REJECTED" or user_obj.team_status != "PENDING"):
                    new_players.append(user_obj)
            except:
                pass
        tournament.players.set(new_players)
        tournament.save()
        return "players changed successfully"


def is_user_in_team(user_name):
    # состоит ли user с именем user_name в КАКОЙ-ЛИБО команде
    user = UserAccount.objects.get(name=user_name)
    if user.team_status is not None and user.team_status != "REJECTED":
        print(user.team_status is None)
        raise serializers.ValidationError("User is already in a team")


def add_team_player(team, user_name, status="PENDING"):
    # добавляет user с именем user_name в команду, team - объект класса Team (models.py)
    player = UserAccount.objects.get(name=user_name)
    if is_user_in_team(user_name):
        return team
    player.team_status = status
    team.players.add(player)
    player.save()
    return team


def change_team_name(team, team_name):
    team.name = team_name
    team.save()
    return "team name changed successfully"


def change_players_status(team, new_players, user_name):
    """
    Этот монстр позволяет капитану менять состав команды
    (принимать челов в команду, удалять их, делать капитаном вместо себя)
    """
    players = team.players.values()
    for p in players:
        if p["name"] == user_name and p["team_status"] == "PENDING":
            for obj in new_players:
                obj = dict(obj)
                player = UserAccount.objects.get(name=obj["name"])
                if player.name == user_name and obj["team_status"] == "REJECTED":
                    player.team_status = None
                    player.team = None
                    player.save()
                    break
            break
        if p["name"] == user_name and p["team_status"] == "CAPTAIN":
            for obj in new_players:
                obj = dict(obj)
                player = UserAccount.objects.get(name=obj["name"])
                if str(player.team_id) == str(p["team_id"]):
                    player.team_status = obj["team_status"]
                    player.save()
                    if obj["team_status"] == "REJECTED":
                        player.team_status = None
                        player.team = None
                        player.save()
                        if team.players.last() is not None:
                            next_cap = team.players.last()
                            next_cap.team_status = "CAPTAIN"
                            next_cap.save()
                        break
                    if player.name == user_name and obj["team_status"] == "REJECTED":
                        player.team_status = None
                        player.team = None
                        player.save()
                        break
            break
    return team


@database_sync_to_async
def async_return_user(token):
    # асинхронное доставание UserAccount по jwt токену из БД для consumers.py -> websocket
    from auth_system.settings import SECRET_KEY
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = UserAccount.objects.get(pk=user_id)
    except:
        user = None
    return user


def update_next_match(next_match, winner):
    # winner - объект класса Participant, next_match - Match
    # добавляем выигравшего в матче участника в следующий матч(создаем нового участника для выигравшей команды)
    next_participant = Participant.objects.create(
        team=winner.team, match=next_match, status="NO_SHOW", result_text="TBD"
    )
    next_match.participants.add(next_participant)
    next_match.save()


def check_captain(data, user) -> bool:
    # проверка на капитана из request.data
    participant = Participant.objects.get(pk=data["participants"][0]["id"])
    if user.team_status == "CAPTAIN" and user.team.id == participant.team.id:
        return True
    return False


def create_message(user, chat, content):
    if len(content) == 0:
        raise serializers.ValidationError("Content must not be an empty string")
    return Message.objects.create(user=user, chat=chat, content=content)


@database_sync_to_async
def async_create_message(user, chat_id, content):
    # асинхронная почти что копия create_message для consumers.py
    chat = Chat.objects.get(pk=chat_id)
    if len(content) == 0:
        raise serializers.ValidationError("Content must not be an empty string")
    chat.save()
    return Message.objects.create(user=user, chat=chat, content=content)


def claim_match_result(match, team_id, result):
    # Ставит результат в Participant т.е. позволяет капитану сделать заявку на результат
    try:
        [p1, p2] = list(match.participants.values())
        p1 = Participant.objects.get(pk=p1["id"])
        if team_id == p1.team.id:
            p1.is_winner = result
            p1.save()
        else:
            p2 = Participant.objects.get(pk=p2["id"])
            p2.is_winner = result
            p2.save()
        end_match(match)
    except:
        print("something went wrong when trying updating match results")
        return


def end_match(match):
    # ставит результат матча с валидацией на одинаковые результаты обеих команд и в случае успеха обновляет след матч
    [p1, p2] = list(match.participants.values())
    p1 = Participant.objects.get(pk=p1["id"])
    p2 = Participant.objects.get(pk=p2["id"])
    next_match = match.next_match
    if not p1.is_winner and p2.is_winner or p1.is_winner == False and p2.is_winner:
        pass
    else:
        print("compromised results!!!".upper())
        return
    match.state = "SCORE_DONE"
    match.save()
    if next_match is None:
        return
    if p1.is_winner:
        p1.result_text = "WON"
        p2.result_text = "LOST"
        p1.status, p2.status = "PLAYED", "PLAYED"
        p1.save()
        p2.save()
        update_next_match(next_match, p1)
        return
    p2.result_text = "WON"
    p1.result_text = "LOST"
    p1.status, p2.status = "PLAYED", "PLAYED"
    p1.save()
    p2.save()
    update_next_match(next_match, p2)


def apply_for_team(team, player):
    team_players_ids = map(lambda x: x["id"], list(team.players.values()))
    if player.id in team_players_ids:
        return "player already applied for this team"
    res = None
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


def remove_from_team(team, player):
    try:
        player.team = None
        player.team_status = None
        player.save()
        if player.name == team.next_member:
            team.next_member = None
            team.save()
        team.players.remove(player)
        return "player kicked from team"
    except:
        return None


def invite_player(team, player):
    if player.team is not None and player.team.id == team.id and player.team_status == "PENDING":
        team.players.add(player)
        player.team_status = "ACTIVE"
        player.save()
        return "player added to the team"
    team.next_member = player.name
    team.save()
    return "player was invited to the team"

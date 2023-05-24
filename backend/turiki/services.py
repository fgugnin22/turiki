from .models import UserAccount, Match, Tournament, Team, Participant, Lobby, Chat, Message
from rest_framework import serializers
import random


def set_tournament_status(tournament, status):
    tournament.status = status
    tournament.save()


def register_team(tournament, team):
    tournament.teams.add(team)
    tournament.save()


def set_initial_matches(tournament):
    matches = list(tournament.matches.values())
    teams = list(tournament.teams.values())
    if len(teams) == 0:
        return
    random.shuffle(teams)
    initial_matches = []
    for match in matches:
        if int(match["name"]) == int(tournament.max_rounds):
            initial_matches.append(match)
    for i, match in enumerate(initial_matches):
        m = Match.objects.get(pk=match["id"])
        team1 = teams.pop()
        team1 = Team.objects.get(pk=team1["id"])
        participant1 = Participant.objects.create(team=team1, match=m, status="NO_SHOW", result_text="TBD")
        team2 = teams.pop()
        team2 = Team.objects.get(pk=team2["id"])
        participant2 = Participant.objects.create(team=team2, match=m, status="NO_SHOW", result_text="TBD")
        m.participants.add(participant1)
        m.participants.add(participant2)


def create_match(next_round_count, rounds, tournament, next_match=None):
    if next_round_count <= 0:
        return
    elif next_round_count == rounds:
        final_match = Match.objects.create(next_match=next_match, name=f"{rounds - next_round_count + 1}",
                                           round_text=f"Матч за {rounds - next_round_count + 1} место", state="NO_SHOW",
                                           tournament=tournament)
        create_match(next_round_count - 1, rounds, tournament, final_match)
    else:
        match1 = Match.objects.create(next_match=next_match, name=f"{rounds - next_round_count + 1}",
                                      round_text=f"Матч за {rounds - next_round_count + 1} место", state="NO_SHOW",
                                      tournament=tournament)
        match2 = Match.objects.create(next_match=next_match, name=f"{rounds - next_round_count + 1}",
                                      round_text=f"Матч за {rounds - next_round_count + 1} место", state="NO_SHOW",
                                      tournament=tournament)
        create_match(next_round_count - 1, rounds, tournament, match1)
        create_match(next_round_count - 1, rounds, tournament, match2)


def create_bracket(tournament, rounds):
    create_match(rounds, rounds, tournament, None)
    return tournament


def is_user_in_team(user_name):
    user = UserAccount.objects.get(name=user_name)
    if user.team_status is not None and user.team_status != "REJECTED":
        print(user.team_status is None)
        raise serializers.ValidationError("User is already in a team")


def add_team_player(team, user_name, status="PENDING"):
    player = UserAccount.objects.get(name=user_name)
    if player.team_status is not None or player.team_status == "REJECTED":
        print("denied", player.name, player.team_status)
        return team
    player.team_status = status
    team.players.add(player)
    player.save()
    return team


def change_team_name(team, user_name, team_name):
    players = list(team.players.values())
    for p in players:
        if p["name"] == user_name and p["team_status"] == "CAPTAIN":
            print(team_name, 123)
            if team_name is None:
                return team
            team.name = team_name

            break
    return team


def change_players_status(team, new_players, user_name):
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


# from turiki.services import end_match
# match = Match.objects.get(pk=26)
# end_match(match)
# participant2 = Participant.objects.create(team=team2, match=m, status="NO_SHOW", result_text="TBD")
def update_next_match(next_match, winner):
    next_participant = Participant.objects.create(team=winner.team, match=next_match, status="NO_SHOW",
                                                  result_text="TBD")
    next_match.participants.add(next_participant)


def check_captain(data, user) -> bool:
    participant = Participant.objects.get(pk=data["participants"][0]["id"])
    if user.team_status == "CAPTAIN" and user.team.id == participant.team.id:
        return True
    return False


# chat
# user
# content
def create_message(user, chat, content):
    if len(content) == 0:
        raise serializers.ValidationError("Content must not be an empty string")
    return Message.objects.create(user=user, chat=chat, content=content)


def create_lobby(match):
    if not (len(match.participants.values()) == 2 and (not ("DONE" in match.state))):
        return
    if match.lobby is not None:
        print("lobby already created")
        return
    chat = Chat.objects.create()
    lobby = Lobby.objects.create(match=match, chat=chat)
    chat.lobby = lobby
    chat.save()
    print("LOBBY CREATED")
    return


def end_match(match):
    [p1, p2] = list(match.participants.values())
    p1 = Participant.objects.get(pk=p1["id"])
    p2 = Participant.objects.get(pk=p2["id"])
    next_match = match.next_match
    if p1.is_winner and p2.is_winner == False or p1.is_winner == False and p2.is_winner:
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
        p1.status = "PLAYED"
        p2.status = "PLAYED"
        p1.save()
        p2.save()
        update_next_match(next_match, p1)
        return
    p2.result_text = "WON"
    p1.result_text = "LOST"
    p1.status = "PLAYED"
    p2.status = "PLAYED"
    p1.save()
    p2.save()
    update_next_match(next_match, p2)


def set_match_winner(match, data):
    [p1, p2] = list(match.participants.values())
    p1 = Participant.objects.get(pk=p1["id"])
    p2 = Participant.objects.get(pk=p2["id"])
    if data["participants"][0]["id"] == p1.id:
        p1.is_winner = data["participants"][0]["is_winner"]
        p1.save()
        return
    p2.is_winner = data["participants"][0]["is_winner"]
    p2.save()

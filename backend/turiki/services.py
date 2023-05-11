from .models import UserAccount, Match, Tournament, Team, Participant
from rest_framework import serializers
import random


def set_tournament_status(tournament, status):
    tournament.status = status
    tournament.save()


def set_initial_matches(tournament):
    matches = list(tournament.matches.values())
    teams = list(tournament.teams.values())
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
        print(m.participants.values())


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
        print("denied", 123421, player.team_status)
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
        if p["name"] == user_name and p["team_status"] == "CAPTAIN":
            for obj in new_players:
                obj = dict(obj)
                player = UserAccount.objects.get(name=obj["name"])
                player.team_status = obj["team_status"]
                player.save()
            break
    return team


# from turiki.services import end_match
# match = Match.objects.get(pk=26)
# end_match(match)

def end_match(match):
    [team1, team2] = list(match.participants.values())
    team1 = Participant.objects.get(pk=team1["id"])
    team2 = Participant.objects.get(pk=team2["id"])
    print(team1, team2)

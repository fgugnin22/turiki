from .models import UserAccount
from rest_framework import serializers


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

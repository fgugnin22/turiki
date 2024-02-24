import random

import dramatiq
import pytz
from rest_framework import serializers

from apscheduler.schedulers.background import BackgroundScheduler
import datetime

from turiki_app.match_services import claim_match_result
from turiki_app.models import Chat, Lobby, Match, Team, Participant, MapBan, Tournament

MSK_TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))
IN_A_MINUTE = datetime.datetime.now() + datetime.timedelta(minutes=0.5)


@dramatiq.actor
def set_match_start_bans(match_id: int):
    match = Match.objects.get(pk=match_id)

    if match.teams.count() != 2:
        return
    if match.state == "NO_SHOW":
        match.state = "BANS"
        [team1, team2] = [Team.objects.get(pk=match.participants.values()[0]["team_id"]),
                          Team.objects.get(pk=match.participants.values()[1]["team_id"])]
        initial_timestamps = [match.starts]
        bans = MapBan.objects.create(match=match, previous_team=team1.id, timestamps=initial_timestamps,
                                     time_to_select_map=match.tournament.time_to_select_map)
        exec_task_on_date(ban_map, [match.id, team2.id, match.bans.maps[-1], "AUTO",
                                    MapBan.DEFAULT_MAP_POOL_SIZE - len(match.bans.maps)],
                          initial_timestamps[-1] + match.bans.time_to_select_map)

        match.bans = bans
        bans.save()
        match.save()


def set_match_active(match):
    set_match_state(match.id)
    create_lobby(match)
    match.save()


def exec_task_on_date(func, args: list, when=datetime.datetime.now()):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func.send, 'date', run_date=when, args=args, misfire_grace_time=300)
    try:
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()


@dramatiq.actor
def check_for_teams_in_lobby(match_id):
    match = Match.objects.get(pk=match_id)
    [p1, p2] = list(match.participants.values())

    p1 = Participant.objects.get(pk=p1["id"])
    p2 = Participant.objects.get(pk=p2["id"])
    if p1.in_lobby and p2.in_lobby:
        return
    if p1.in_lobby and not p2.in_lobby:
        claim_match_result(match.id, p1.team.id, True)
        claim_match_result(match.id, p2.team.id, False)
        return
        # make p1 win and p2 lose
    if not p1.in_lobby and p2.in_lobby:
        claim_match_result(match.id, p2.team.id, True)
        claim_match_result(match.id, p1.team.id, False)
        return
        # make p2 win and p1 lose
    print("nobody enter lobby, retrying again in (amount of time to enter the lobby)")
    exec_task_on_date(check_for_teams_in_lobby, [match.id],
                      datetime.datetime.now(tz=pytz.timezone('Europe/Moscow')) + match.time_to_enter_lobby)


@dramatiq.actor
def ban_map(match_id, team_id, map_to_ban, who_banned=MapBan.CAPTAIN, move=0):
    """Я в афиге.... чсно гря"""
    team = Team.objects.get(pk=team_id)
    match = Match.objects.get(pk=match_id)

    if len(match.bans.maps) == 1 or (match.is_bo3 and len(match.bans.maps) == 3):
        return

    if not map_to_ban.upper() in match.bans.maps:
        return

    if match.bans.previous_team == team_id:
        return
    try:
        if match.bans.ban_log[move] == MapBan.CAPTAIN:
            print('CAPTAIN VOTED FOR MAPBAN, AUTO BAN CANCELLED')
            return
    except:
        pass
    a = list(match.participants.values())
    other_team_id = a[0]["team_id"] if a[0]["team_id"] != team.id else a[1]["team_id"]
    other_team = Team.objects.get(pk=other_team_id)
    match.bans.maps.remove(map_to_ban.upper())
    match.bans.previous_team = team.id
    match.bans.timestamps.append(datetime.datetime.now() + datetime.timedelta(seconds=1))
    match.bans.ban_log.append(who_banned)
    if len(match.bans.maps) == 1 or (match.is_bo3 and len(match.bans.maps) == 3):
        if not match.is_bo3:
            match.current_map = match.bans.maps[0]
        if match.is_bo3:
            match.current_map = match.bans.maps[0]
        exec_task_on_date(check_for_teams_in_lobby, [match.id],
                          datetime.datetime.now(tz=pytz.timezone("Europe/Moscow")) + match.time_to_enter_lobby)
        set_match_active(match)

    exec_task_on_date(ban_map, [match.id, other_team.id, match.bans.maps[-1], "AUTO",
                                MapBan.DEFAULT_MAP_POOL_SIZE - len(match.bans.maps)],
                      datetime.datetime.now() + match.bans.time_to_select_map)
    match.bans.save()
    match.save()


@dramatiq.actor
def set_match_state(match_id, status="IN_GAME_LOBBY_CREATION"):  # self-explanatory fr tho
    match = Match.objects.get(pk=match_id)
    if match.state == "BANS":
        match.started = datetime.datetime.now(tz=pytz.timezone('Europe/Moscow'))
        match.state = "IN_GAME_LOBBY_CREATION"
    else:
        match.state = status
    match.save()

@dramatiq.actor
def auto_finish_match(match_id, team_id, result):
    match = Match.objects.get(pk=match_id)
    from turiki_app.match_services import claim_match_result
    claim_match_result(match.id, team_id, result)


# TODO: сделать отложенную активацию матча и создание лобби
@dramatiq.actor
def create_lobby(match):
    # создание лобби и чата в матче если в нем есть 2 команды, он не закончен
    try:
        if match.lobby is not None:
            print("lobby already created")
    except:
        chat = Chat.objects.create()
        lobby = Lobby.objects.create(match=match, chat=chat)
        chat.lobby = lobby
        chat.save()
        print("LOBBY CREATED")


@dramatiq.actor
def set_tournament_status(tournament_id, status):
    tournament = Tournament.objects.get(pk=tournament_id)
    tournament.status = status
    tournament.save()



# TODO: сделать отложенное автоматическое наполнение матчей
@dramatiq.actor
def set_initial_matches(tournament):
    """
    Эта функция наполняет начальные матчи(матчи на максимальной глубине)
    присутствует рандомизация команд
    """
    matches = list(tournament.matches.values())
    teams = list(tournament.teams.values())
    random.shuffle(teams)
    initial_matches = []
    exec_task_on_date(set_tournament_status, [tournament.id, tournament.allowed_statuses[-2]], when=tournament.starts)
    for match in matches:
        is_match_initial = match["is_last"]
        if is_match_initial:
            initial_matches.append(match)
    for _, match in enumerate(initial_matches):
        match_object = Match.objects.get(pk=match["id"])
        team1 = teams.pop()
        team1 = Team.objects.get(pk=team1["id"])
        participant1 = Participant.objects.create(
            team=team1, match=match_object, status="NO_SHOW", result_text="TBD"
        )
        match_object.participants.add(participant1)
        match_object.save()
    for _, match in enumerate(initial_matches):
        match_object = Match.objects.get(pk=match["id"])
        if len(teams) == 0:
            print(match_object.participants.values())
            exec_task_on_date(auto_finish_match, [match_object.id, match_object.participants.first().team.id, True], when=match_object.tournament.starts)
            continue
        team2 = teams.pop()
        team2 = Team.objects.get(pk=team2["id"])
        participant2 = Participant.objects.create(
            team=team2, match=match_object, status="NO_SHOW", result_text="TBD"
        )
        match_object.starts = tournament.starts
        exec_task_on_date(set_match_start_bans, [match_object.id], when=tournament.starts)
        match_object.participants.add(participant2)
        match_object.save()
    tournament.save()


# TODO: автоматическое отложенное создание сетки перед началом за какое-то кол-во времени
@dramatiq.actor
def create_bracket(tournament, rounds):
    # вызывает функцию create_match я хз зачем так непонятно сделал с именами, потом переделаю TODO:!!!
    if tournament.status != tournament.allowed_statuses[4]:
        raise serializers.ValidationError("Создать сетку можно ТОЛЬКО после чек-ин'а")
    is_enough_teams_to_start_tournament = (2 ** (rounds - 1) < len(list(tournament.teams.values())) <= 2 ** rounds and len(
        list(tournament.matches.values())) == 0)
    if is_enough_teams_to_start_tournament:
        create_match(rounds, rounds, tournament, None, tournament.starts)
        return tournament
    raise serializers.ValidationError("Неверное кол-во команд для заданного кол-ва раундов в турнире!")


@dramatiq.actor
def create_match(next_round_count, rounds, tournament, next_match=None, starts=datetime.datetime.now()):
    """
    Создает турнирную сетку
    кол-во раундов определяет глубину сетки:
    1 раунд - 1 матч, 2 раунда - 3 матча, 3 раунда - 7 матчей, N раундов - (2^N - 1) матчей
    каждый матч кроме финала содержит ссылку на следующий матч
    пока что создает только single elimination bracket
    """
    if next_round_count <= 0:
        return
    elif next_round_count == rounds:
        final_match = Match.objects.create(
            next_match=next_match,
            name=f"{rounds - next_round_count + 1}",
            round_text=f"Матч за {rounds - next_round_count + 1} место",
            state="NO_SHOW",
            tournament=tournament,
            starts=None,
            time_to_enter_lobby=tournament.time_to_enter_lobby,
            time_results_locked=tournament.time_results_locked,
            time_to_confirm_results=tournament.time_to_confirm_results,
            is_last=True,
            is_bo3=True
        )
        # time_to_start_match_from_beginning_of_tournament = datetime.timedelta(minutes=(next_round_count - 1) * 60)
        create_match(next_round_count - 1, rounds, tournament, final_match, starts)
    else:
        starts = None
        match1 = Match.objects.create(
            next_match=next_match,
            name=f"{rounds - next_round_count + 1}",
            round_text=f"Матч за {rounds - next_round_count + 1} место",
            state="NO_SHOW",
            tournament=tournament,
            starts=starts,
            time_to_enter_lobby=tournament.time_to_enter_lobby,
            time_results_locked=tournament.time_results_locked,
            time_to_confirm_results=tournament.time_to_confirm_results,
            is_last=True
        )
        match2 = Match.objects.create(
            next_match=next_match,
            name=f"{rounds - next_round_count + 1}",
            round_text=f"Матч за {rounds - next_round_count + 1} место",
            state="NO_SHOW",
            tournament=tournament,
            starts=starts,
            time_to_enter_lobby=tournament.time_to_enter_lobby,
            time_results_locked=tournament.time_results_locked,
            time_to_confirm_results=tournament.time_to_confirm_results,
            is_last=True
        )
        match1.next_match.is_last = False
        match1.next_match.save()
        create_match(next_round_count - 1, rounds, tournament, match1, starts)
        create_match(next_round_count - 1, rounds, tournament, match2, starts)

import random

import dramatiq
from rest_framework import serializers

from turiki.models import *
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone, timedelta
from turiki.models import Chat, Lobby, Match, Team, Participant

MSK_TIMEZONE = timezone(timedelta(hours=3))
IN_A_MINUTE = datetime.now() + timedelta(minutes=0.5)


# TODO: rabbitmq server start script path: C:\Program Files\RabbitMQ Server\rabbitmq_server-3.11.17\sbin

@dramatiq.actor
def set_match_start_bans(match_id: int):
    match = Match.objects.get(pk=match_id)
    if match.state == "NO_SHOW":
        match.state = "BANS"
        bans = MapBan.objects.create(match=match)
        match.bans = bans
        match.save()


@dramatiq.actor
def set_match_active(match):
    set_active(match)
    create_lobby(match)
    match.save()


def exec_task_on_date(func, args: list, when=datetime.now()):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func.send, 'date', run_date=when, args=args, misfire_grace_time=10 ** 6)
    print(when)
    try:
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()


# py manage.py shell
# from turiki.tasks import *
# [exec_task_on_date(set_match_state, [56, f"ACTIVE{i*10123}"], IN_A_MINUTE) for i in range(10)]
# py manage.py rundramatiq --threads 8 --processes 8
@dramatiq.actor
def set_active(match):  # self-explanatory fr tho
    if match.state == "BANS":
        match.state = "ACTIVE"
        print("BLACK MEN SHAKING THEIR BOOTY CHEEKS")
        match.save()


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
def set_tournament_status(tournament, status):
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
    is_enough_teams_to_start = len(teams) == 2 ** tournament.max_rounds
    if not is_enough_teams_to_start:
        raise serializers.ValidationError("Неверное кол-во команд для наполнения начальных матчей")
    random.shuffle(teams)
    initial_matches = []
    for match in matches:
        is_match_initial = int(match["name"]) == int(tournament.max_rounds)
        if is_match_initial:
            initial_matches.append(match)
    for i, match in enumerate(initial_matches):
        match_object = Match.objects.get(pk=match["id"])
        team1 = teams.pop()
        team1 = Team.objects.get(pk=team1["id"])
        participant1 = Participant.objects.create(
            team=team1, match=match_object, status="NO_SHOW", result_text="TBD"
        )
        team2 = teams.pop()
        team2 = Team.objects.get(pk=team2["id"])
        participant2 = Participant.objects.create(
            team=team2, match=match_object, status="NO_SHOW", result_text="TBD"
        )
        match_object.participants.add(participant1)
        match_object.participants.add(participant2)


# TODO: автоматическое отложенное создание сетки перед началом за какое-то кол-во времени
@dramatiq.actor
def create_bracket(tournament, rounds):
    # вызывает функцию create_match я хз зачем так непонятно сделал с именами, потом переделаю TODO:!!!
    is_enough_teams_to_start_tournament = len(list(tournament.teams.values())) == 2 ** rounds and len(
        list(tournament.matches.values())) == 0
    if is_enough_teams_to_start_tournament:
        create_match(rounds, rounds, tournament, None)
        return tournament
    raise serializers.ValidationError("Недостаточно команд для старта турнира")


@dramatiq.actor
def create_match(next_round_count, rounds, tournament, next_match=None, starts=datetime.now()):
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
            starts=starts
        )
        time_to_start_match_from_beginning_of_tournament = timedelta(minutes=(next_round_count - 1) * 60)
        exec_task_on_date(set_match_start_bans, [final_match.id],
                          when=starts + time_to_start_match_from_beginning_of_tournament)
        create_match(next_round_count - 1, rounds, tournament, final_match, starts)
    else:
        match1 = Match.objects.create(
            next_match=next_match,
            name=f"{rounds - next_round_count + 1}",
            round_text=f"Матч за {rounds - next_round_count + 1} место",
            state="NO_SHOW",
            tournament=tournament,
            starts=starts
        )
        match2 = Match.objects.create(
            next_match=next_match,
            name=f"{rounds - next_round_count + 1}",
            round_text=f"Матч за {rounds - next_round_count + 1} место",
            state="NO_SHOW",
            tournament=tournament,
            starts=starts
        )
        exec_task_on_date(set_match_start_bans, [match1.id], when=starts)
        exec_task_on_date(set_match_start_bans, [match2.id], when=starts)
        create_match(next_round_count - 1, rounds, tournament, match1, starts)
        create_match(next_round_count - 1, rounds, tournament, match2, starts)

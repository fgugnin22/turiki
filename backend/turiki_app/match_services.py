from datetime import datetime, timedelta
import pytz
from rest_framework.response import Response

from turiki_app.models import Participant


def claim_match_result(match, team_id, result):
    # Ставит результат в Participant т.е. позволяет капитану сделать заявку на результат
    try:
        if match.started + match.time_results_locked >= datetime.now(tz=pytz.timezone('Europe/Moscow')):
            return Response(status=400)
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
    if p1.is_winner == p2.is_winner:
        print("compromised results!!!".upper())
        return
    from turiki_app.tasks import exec_task_on_date, auto_finish_match
    if p1.is_winner is None and p2.is_winner:
        match.first_result_claimed = datetime.now(tz=pytz.timezone("Europe/Moscow"))
        print(1, 'WHAWJENTAOWIENTIJWENTIJAWEBTIKAJW4FGIJWAEBGKHJAERWBFJKHAWERBFHJAW')
        exec_task_on_date(auto_finish_match, [match.id, p1.team.id, False],
                          datetime.now(tz=pytz.timezone("Europe/Moscow")) + match.time_to_confirm_results)
    elif p2.is_winner is None and p1.is_winner:
        match.first_result_claimed = datetime.now(tz=pytz.timezone("Europe/Moscow"))
        print(2, 'WHAWJENTAOWIENTIJWENTIJAWEBTIKAJW4FGIJWAEBGKHJAERWBFJKHAWERBFHJAW')
        exec_task_on_date(auto_finish_match, [match.id, p2.team.id, False],
                          datetime.now(tz=pytz.timezone("Europe/Moscow")) + match.time_to_confirm_results)
    if p1.is_winner is None or p2.is_winner is None:
        match.save()
        return
    match.state = "SCORE_DONE"
    match.save()
    if p1.is_winner:
        p1.result_text = "WON"
        p2.result_text = "LOST"
        p1.status, p2.status = "PLAYED", "PLAYED"
        p1.save()
        p2.save()
        if next_match is None:
            tournament = match.tournament
            tournament.status = "PLAYED"
            tournament.save()
            return
        update_next_match(next_match, p1)
        return
    p2.result_text = "WON"
    p1.result_text = "LOST"
    p1.status, p2.status = "PLAYED", "PLAYED"
    p1.save()
    p2.save()
    if next_match is None:
        tournament = match.tournament
        tournament.status = "PLAYED"
        tournament.save()
        return
    update_next_match(next_match, p2)


def update_next_match(next_match, winner):
    # winner - объект класса Participant, next_match - Match
    # добавляем выигравшего в матче участника в следующий матч(создаем нового участника для выигравшей команды)
    next_participant = Participant.objects.create(
        team=winner.team, match=next_match, status="NO_SHOW", result_text="TBD"
    )
    next_match.participants.add(next_participant)
    next_match.save()
    if len(list(next_match.participants.values())) == 2:
        next_match.starts = datetime.now() + timedelta(seconds=10)
        next_match.save()
        from turiki_app.tasks import set_match_start_bans
        set_match_start_bans(next_match.id)

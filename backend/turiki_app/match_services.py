from datetime import datetime, timedelta
import pytz
from rest_framework.response import Response
from turiki_app.models import Chat, Lobby, Participant, Message, Match, UserAccount

def claim_match_result(match_id: int, team_id, result):
    # Ставит результат в Participant т.е. позволяет капитану сделать заявку на результат

    # try:
    match = Match.objects.get(pk=match_id)
    if match.participants.count() == 1:
        p1 = match.participants.first()
        p1.is_winner = True
        p1.save()
        end_match(match)
        return
    if match.started + match.time_results_locked >= datetime.now(tz=pytz.timezone('Europe/Moscow')):
        return Response(status=400)
    p1: Participant = match.participants.first()
    p2: Participant = match.participants.last()
    if p1.is_winner == p2.is_winner and p1.is_winner:
        return
    if team_id == p1.team.id:
        p1.is_winner = result
        p1.save()
        if not result and match.state != "SCORE_DONE":
            notify(match, f"Команда {p1.team.name} выставила свой результат: поражение!")
    else:
        p2.is_winner = result
        p2.save()
        if not result and match.state != "SCORE_DONE":
            notify(match, f"Команда {p2.team.name} выставила свой результат: поражение!")
    end_match(match)


# except:
#     print("something went wrong when trying updating match results")
#     return


def notify(match, content):
    chat = match.lobby.chat
    user: UserAccount = UserAccount.objects.filter(is_superuser=True)[0]
    msg_type = "notification"
    msg = Message(chat=chat,
                  user=user,
                  content=content,
                  type=msg_type)
    msg.save()
    chat.messages.add(msg)
    chat.save()


def end_match(match: Match):
    # ставит результат матча с валидацией на одинаковые результаты обеих команд и в случае успеха обновляет след матч
    from turiki_app.tasks import exec_task_on_date, auto_finish_match
    if match.participants.count() == 1:
        p1 = match.participants.first()
        next_match = match.next_match
        p1.result_text = "WON"
        p1.status = "PLAYED"
        p1.save()
        match.state = "SCORE_DONE"
        match.save()
        print('321')
        if next_match is None:
            # this block should not run but i leave it anyways
            tournament = match.tournament
            tournament.status = match.tournament.allowed_statuses[-1]
            tournament.save()
            return
        update_next_match(next_match, p1)
        return
    p1: Participant = match.participants.first()
    p2: Participant = match.participants.last()

    messages = match.lobby.chat.messages

    if p1.is_winner is None and p2.is_winner:
        if match.state != "SCORE_DONE" and messages.filter(content=f"Команда {p2.team.name} выставила свой результат: победа!").count() == 0:
            notify(match, f"Команда {p2.team.name} выставила свой результат: победа!")
    elif p2.is_winner is None and p1.is_winner and messages.filter(content=f"Команда {p1.team.name} выставила свой результат: победа!").count() == 0:
        if match.state != "SCORE_DONE":
            notify(match, f"Команда {p1.team.name} выставила свой результат: победа!")
    if p1.is_winner == p2.is_winner:
        notify(match, "Результат матча оспорен!")
        match.state = "CONTESTED"
        match.save()
        return
    if p1.is_winner is None and p2.is_winner:
        match.first_result_claimed = datetime.now(tz=pytz.timezone("Europe/Moscow"))
        exec_task_on_date(auto_finish_match, [match.id, p1.team.id, False],
                          datetime.now(tz=pytz.timezone("Europe/Moscow")) + match.time_to_confirm_results)
    elif p2.is_winner is None and p1.is_winner:
        match.first_result_claimed = datetime.now(tz=pytz.timezone("Europe/Moscow"))
        exec_task_on_date(auto_finish_match, [match.id, p2.team.id, False],
                          datetime.now(tz=pytz.timezone("Europe/Moscow")) + match.time_to_confirm_results)
    if p1.is_winner is None or p2.is_winner is None:
        match.save()
        return
    match.state = "SCORE_DONE"
    match.save()

    prev_match = match.tournament.matches.filter(next_match__id=match.id).first()

    next_match = match.next_match

    if p1.is_winner:
        p1.result_text = "WON"
        p2.result_text = "LOST"
        p1.status, p2.status = "PLAYED", "PLAYED"
        p1.save()
        p2.save()
        notify(match, f"Команда {p1.team.name} выиграла!")

        if match.is_bo3 and match.bo3_order < 2 and (prev_match is None or not (match.bo3_order == 1 and prev_match.participants.filter(result_text="WON").first().team.id == p1.team.id)):
            print(2222)
            tournament = match.tournament
            match.next_match = Match.objects.create(
                next_match=next_match,
                name=match.name,
                round_text=match.round_text,
                state="NO_SHOW",
                tournament=tournament,
                starts=datetime.now(tz=pytz.timezone('Europe/Moscow')) + timedelta(minutes=1),
                time_to_enter_lobby=tournament.time_to_enter_lobby,
                time_results_locked=tournament.time_results_locked,
                time_to_confirm_results=tournament.time_to_confirm_results,
                is_last=match.is_last,
                is_bo3=True,
                is_visible=True,
                bo3_order=match.bo3_order+1,
                current_map=match.bans.maps[match.bo3_order + 1]
            )
            match.is_visible = False
            match.next_match.bans = match.bans
            match.bans = None
            match.save()
            match.next_match.save()
            update_next_match(match.next_match, p1)
            update_next_match(match.next_match, p2)
            print(6666)
            return

        if next_match is None:
            tournament = match.tournament
            tournament.status = match.tournament.allowed_statuses[-1]
            tournament.save()
            return
        update_next_match(next_match, p1)
        return
    p2.result_text = "WON"
    p1.result_text = "LOST"
    p1.status, p2.status = "PLAYED", "PLAYED"
    p1.save()
    p2.save()
    notify(match, f"Команда {p2.team.name} выиграла!")
    print(3333)
    if match.is_bo3 and match.bo3_order < 2 and (prev_match is None or not (match.bo3_order == 1 and prev_match.participants.filter(result_text="WON").first().team.id == p2.team.id)):
        print(4444)
        tournament = match.tournament
        match.next_match = Match.objects.create(
            next_match=next_match,
            name=match.name,
            round_text=match.round_text,
            state="NO_SHOW",
            tournament=tournament,
            starts=datetime.now(tz=pytz.timezone('Europe/Moscow')) + timedelta(minutes=1),
            time_to_enter_lobby=tournament.time_to_enter_lobby,
            time_results_locked=tournament.time_results_locked,
            time_to_confirm_results=tournament.time_to_confirm_results,
            is_last=match.is_last,
            is_bo3=True,
            is_visible=True,
            bo3_order=match.bo3_order + 1,
            current_map=match.bans.maps[match.bo3_order + 1]
        )
        match.is_visible = False
        match.next_match.bans = match.bans
        match.bans = None
        match.save()
        match.next_match.save()
        update_next_match(match.next_match, p1)
        update_next_match(match.next_match, p2)
        print(5555)
        return
    if next_match is None:
        tournament = match.tournament
        tournament.status = match.tournament.allowed_statuses[-1]
        tournament.save()
        return
    update_next_match(next_match, p2)


def update_next_match(next_match: Match, winner):
    # winner - объект класса Participant, next_match - Match
    # добавляем выигравшего в матче участника в следующий матч(создаем нового участника для выигравшей команды)
    print(next_match)
    next_participant = Participant.objects.create(
        team=winner.team, match=next_match, status="NO_SHOW", result_text="TBD"
    )
    next_match.participants.add(next_participant)
    next_match.save()
    if len(list(next_match.participants.values())) == 2:
        next_match.starts = datetime.now() + timedelta(seconds=10)
        next_match.save()
        if next_match.is_bo3 and next_match.bo3_order > 0:
            next_match.started = datetime.now(tz=pytz.timezone('Europe/Moscow'))
            next_match.state = "IN_GAME_LOBBY_CREATION"
            try:
                if next_match.lobby is not None:
                    print("lobby already created")
            except:
                chat = Chat.objects.create()
                lobby = Lobby.objects.create(match=next_match, chat=chat)
                chat.lobby = lobby
                chat.save()
                print("LOBBY CREATED")
            next_match.save()
            return
        from turiki_app.tasks import set_match_start_bans
        set_match_start_bans(next_match.id)

import dramatiq
from turiki.models import *
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timezone, timedelta
import types


# TODO: rabbitmq server start script path: C:\Program Files\RabbitMQ Server\rabbitmq_server-3.11.17\sbin

@dramatiq.actor
def set_match_state(match_id: int, state: str):
    match: type(Match) = Match.objects.get(pk=match_id)
    match.state = state
    match.save()


MSK_TIMEZONE = timezone(timedelta(hours=3))
IN_A_MINUTE = datetime.now() + timedelta(minutes=0.5)


def ball():
    scheduler = BackgroundScheduler()
    scheduler.add_job(set_match_state.send, 'date',
                      run_date=IN_A_MINUTE,
                      args=[56, "ACTIVE"])  # работает
    try:
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()


def exec_task_on_date(func: type(set_match_state), args: list, when: type(datetime)):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func.send, 'date', run_date=when, args=args)
    try:
        scheduler.start()
    except:
        scheduler.shutdown()
#  py manage.py shell
# from turiki.tasks import *
# a = set_match_state
# x = [a.send_with_options(args=(56, "ACTIVE"), delay=(i+1) * 500) for i in range(15)]
# print()

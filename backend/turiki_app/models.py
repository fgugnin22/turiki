import datetime
import os

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.postgres import fields
from django.utils.timezone import now
from core.settings import BASE_DIR

"""
В этом файле описывается структура сущностей в базе данных, их взаимодействие друг с другом
По этому файлу django автоматически строит миграции в бд (py manage.py makemigrations -> py manage.py migrate)
"""


def images_path():
    return "media/img"


def payment_default():
    return {"tournament": {
        "id": -1,
        "is_confirmed": False
    }}


def default_starts():
    return now() + datetime.timedelta(minutes=1)


class Tournament(models.Model):
    allowed_statuses = ["REGISTRATION_CLOSED_BEFORE_REG",
                        "REGISTRATION_OPENED",
                        "REGISTRATION_CLOSED_AFTER_REG",
                        "CHECK_IN",
                        "CHECK_IN_CLOSED",
                        "ACTIVE",
                        "PLAYED"]
    name = models.CharField(max_length=255, default=f"Tounrmaent")
    prize = models.IntegerField(default=0)
    status = models.CharField(default="REGISTRATION_CLOSED_BEFORE_REG", max_length=255)
    starts = models.DateTimeField(blank=True, null=True)
    players = models.ManyToManyField("UserAccount", blank=True)
    max_rounds = models.IntegerField(default=1)
    # time_to_register = models.DurationField(default=datetime.timedelta(minutes=3))
    time_to_check_in = models.DurationField(default=datetime.timedelta(minutes=3))
    reg_starts = models.DateTimeField(default=default_starts)
    max_players_in_team = models.SmallIntegerField(default=5)
    time_to_enter_lobby = models.DurationField(default=datetime.timedelta(minutes=10))
    time_results_locked = models.DurationField(default=datetime.timedelta(minutes=1))
    time_to_confirm_results = models.DurationField(default=datetime.timedelta(minutes=2))
    time_to_select_map = models.DurationField(default=datetime.timedelta(minutes=2))
    overview_info = models.CharField(default=str, max_length=1024)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=20, null=True, blank=True, unique=True)
    description = models.CharField(max_length=128, null=True, blank=True, unique=False)
    tournaments = models.ManyToManyField(Tournament, related_name="teams", blank=True)
    next_member = models.CharField(null=True, blank=True, max_length=255)
    image = models.FilePathField(path=images_path(), blank=True, null=True)
    is_open = models.BooleanField(default=True)
    is_join_confirmation_necessary = models.BooleanField(default=True)

    payment = models.JSONField(default=payment_default)

    def __str__(self):
        return self.name


class MapBan(models.Model):
    CHALET = "CHALET"
    BANK = "BANK"
    BORDER = "BORDER"
    CLUBHOUSE = "CLUBHOUSE"
    KAFE = "KAFE"
    OREGON = "OREGON"
    SKYSCRAPER = "SKYSCRAPER"
    NIGHTHAVENLABS = "NIGHTHAVEN"
    CONSULATE = "CONSULATE"

    ADMIN = "ADMIN"
    CAPTAIN = "CAPTAIN"
    AUTO = "AUTO"

    WHO_CAN_BAN = (
        (ADMIN, ADMIN.lower()),
        (CAPTAIN, CAPTAIN.lower()),
        (AUTO, AUTO.lower()),
    )

    DEFAULT_COMPETITIVE_MAP_CHOICES_TUPLE = (
        (CHALET, CHALET.lower()),
        (BANK, BANK.lower()),
        (BORDER, BORDER.lower()),
        (CLUBHOUSE, CLUBHOUSE.lower()),
        (KAFE, KAFE.lower()),
        (OREGON, OREGON.lower()),
        (SKYSCRAPER, SKYSCRAPER.lower()),
        (NIGHTHAVENLABS, NIGHTHAVENLABS.lower()),
        (CONSULATE, CONSULATE.lower())
    )

    def get_default_map_pool(self=None):
        return [
            "CHALET",
            "BANK",
            "BORDER",
            "CLUBHOUSE",
            "KAFE",
            "OREGON",
            "SKYSCRAPER",
            "NIGHTHAVEN",
            "CONSULATE"
        ]

    DEFAULT_MAP_POOL_SIZE = len(DEFAULT_COMPETITIVE_MAP_CHOICES_TUPLE)

    def get_init_ban_log(self=None):
        return [] * (MapBan.DEFAULT_MAP_POOL_SIZE - 1)

    time_to_select_map = models.DurationField(default=datetime.timedelta(seconds=15))
    previous_team = models.IntegerField(default=0)
    timestamps = fields.ArrayField(
        base_field=models.DateTimeField(blank=True),
        size=DEFAULT_MAP_POOL_SIZE,
        default=list
    )
    ban_log = fields.ArrayField(
        base_field=models.CharField(max_length=15, choices=WHO_CAN_BAN),
        size=DEFAULT_MAP_POOL_SIZE - 1,
        default=get_init_ban_log
    )
    maps = fields.ArrayField(
        base_field=models.CharField(max_length=30, choices=DEFAULT_COMPETITIVE_MAP_CHOICES_TUPLE, default=None,
                                    null=True),
        size=DEFAULT_MAP_POOL_SIZE,
        default=get_default_map_pool)
    picked_maps = fields.ArrayField(
        base_field=models.CharField(max_length=30, choices=DEFAULT_COMPETITIVE_MAP_CHOICES_TUPLE, default=None,
                                    null=True),
        size=DEFAULT_MAP_POOL_SIZE,
        default=list)
    def __str__(self):
        return f"{self.id}"


class Match(models.Model):
    bans = models.OneToOneField(MapBan, on_delete=models.CASCADE, blank=True, null=True)
    teams = models.ManyToManyField(Team, related_name="matches", blank=True, through="Participant")
    next_match = models.ForeignKey('Match', unique=False, on_delete=models.SET_NULL, related_name='previous_match',
                                   null=True, blank=True)
    name = models.CharField(max_length=127, blank=True, null=True)
    round_text = models.CharField(max_length=31, blank=True, null=True)  # ПОРЯДОК СЛЕДОВАНИЯ МАТЧЕЙ
    # В ТУРНИРЕ, Т.Е. 1 - ПЕРВЫЕ МАТЧИ В ТУРНИРЕ, 2 - ВТОРЫЕ И ТД. п.с. на самом деле это не обязательно, просто рекомендация)))
    state = models.CharField(max_length=63, null=True, blank=True)
    started = models.DateTimeField(blank=True, null=True)  # начинается игра в матче
    starts = models.DateTimeField(blank=True, null=True)  # начинается матч
    first_result_claimed = models.DateTimeField(blank=True, null=True)
    time_to_enter_lobby = models.DurationField(default=datetime.timedelta(minutes=10))
    time_results_locked = models.DurationField(default=datetime.timedelta(minutes=1))
    time_to_confirm_results = models.DurationField(default=datetime.timedelta(minutes=2))
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches",
                                   null=True, blank=True, )
    is_last = models.BooleanField(default=False)
    is_bo3 = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    bo3_order = models.IntegerField(default=0)
    current_map = models.CharField(null=True, blank=True)

    def get_participants(self):
        arr = list(self.teams.values())
        if len(arr) == 0:
            return ""
        elif len(arr) == 1:
            return f"{arr[0]['name']}_VS_"
        elif len(arr) == 2:
            return f"_{arr[0]['name']}_VS_{arr[1]['name']}"

    def __str__(self):
        return f"{self.tournament.name}_match_id_{self.id}_{self.get_participants()}"

    def __repr__(self):  # пока что не нужен
        return f"{self.teams, self.state, self.starts, self.tournament}"


class Participant(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True, related_name="games")
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name="participants", blank=True, null=True)
    status = models.CharField(max_length=31, null=True, blank=True)
    is_winner = models.BooleanField(null=True, blank=True)
    result_text = models.CharField(max_length=31, null=True, blank=True)
    in_lobby = models.BooleanField(default=False)
    res_image = models.FilePathField(path=images_path(), blank=True, null=True)

    def __str__(self):
        return f"{self.team}_{self.match}"


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email required!')

        name = extra_fields.get("name", email.split("@")[0])
        extra_fields.pop("name", None)
        print(extra_fields)
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email required!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.is_superuser = 1
        user.is_staff = 1
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    def is_google_oauth2(self):
        if self.name is None:
            return True
        return False

    objects = UserAccountManager()
    email = models.EmailField(max_length=100, unique=True)
    name = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL, related_name="players")
    team_status = models.CharField(max_length=31, null=True, blank=True)
    google_oauth2 = models.BooleanField(default=False)
    image = models.FilePathField(path=images_path(), blank=True, null=True,
                                 default="media/img/defaultuser.svg")
    game_name = models.CharField(max_length=63, null=True,
                                 blank=True,
                                 unique=True)  # здесь пока что будет игровой ник, в будущем будет несколько полей, каждое для своей игры
    USERNAME_FIELD = 'email'  # что является логином
    REQUIRED_FIELDS = ['name']  # обязательные поля

    def __str__(self):
        return self.name


class Lobby(models.Model):
    match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name="lobby")

    def __str__(self):
        return f"{self.match}"


class Chat(models.Model):
    is_team = models.BooleanField(default=False)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, null=True, blank=True, related_name="chats")


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    content = models.CharField(max_length=512, blank=False, null=False)
    created_at = models.DateTimeField(blank=True, null=True)
    type = models.CharField(max_length=31, default="message")

    def __str__(self):
        return f"{self.user}_{self.content}_at_{self.created_at}_{self.chat}"


class Notification(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    kind = models.CharField(max_length=32)
    content = models.JSONField(default=dict)
    is_read = models.BooleanField(default=False)

from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


# модель пользователя с логином - почтой(у жанго по умолчанию логин - имя пользователя)

# управление моделью пользователя
class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        print(extra_fields)
        if not email:
            raise ValueError('Email required!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    # создать админа(потом)

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email required!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.is_superuser = 1
        user.is_staff = 1
        print(user)
        user.save()
        return user


class Tournament(models.Model):
    name = models.CharField(max_length=255, default="Tournament")
    prize = models.IntegerField(default=0)
    status = models.CharField(default="REGISTRATION OPENED", max_length=255)
    starts = models.CharField(max_length=255, default="15.05.2023")
    # teams = models.ManyToManyField("Team", through="IDK KAK BUDET NAZIVATSYA") <-- TODO: SDELAT'
    max_rounds = models.IntegerField(default=1)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True, unique=True)
    tournaments = models.ManyToManyField(Tournament, related_name="teams", null=True, blank=True, )
    next_member = models.CharField(null=True, blank=True, max_length=255)

    def __str__(self):
        return self.name


#
#


class Match(models.Model):
    teams = models.ManyToManyField(Team, related_name="matches", null=True, blank=True, through="Participant")
    next_match = models.ForeignKey('Match', unique=False, on_delete=models.SET_NULL, related_name='previous_match',
                                   null=True, blank=True)
    name = models.CharField(max_length=127, blank=True, null=True)
    round_text = models.CharField(max_length=31, blank=True, null=True)  # ПОРЯДОК СЛЕДОВАНИЯ МАТЧЕЙ
    # В ТУРНИРЕ, Т.Е. 1 - ПЕРВЫЕ МАТЧИ В ТУРНИРЕ, 2 - ВТОРЫЕ И ТД. п.с. на самом деле это не обязательно, просто рекомендация)))
    state = models.CharField(max_length=31, null=True, blank=True)
    starts = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches",
                                   null=True, blank=True, )

    def get_participants(self):
        arr = list(self.teams.values())
        print(arr)
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

    def __str__(self):
        return f"{self.team}_{self.match}"


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()
    is_captain = models.BooleanField(default=False)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL, related_name="players")
    team_status = models.CharField(max_length=31, null=True, blank=True)
    USERNAME_FIELD = 'email'  # что является логином
    REQUIRED_FIELDS = ['name']  # обязательные поля

    def __str__(self):
        return self.name

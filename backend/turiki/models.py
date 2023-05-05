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


class TournamentManager(models.Manager):
    def create_tournament(self, name, **extra_fields):
        if not name:
            raise ValueError('name required!')
        tournament = self.model(name=name, **extra_fields)
        tournament.save()
        return tournament


class MatchManager(models.Manager):
    pass


class TeamManager(models.Manager):
    pass


class Tournament(models.Model):
    name = models.CharField(max_length=255, default="balls")
    prize = models.IntegerField(default=0)
    registration_opened = models.BooleanField(default=True)
    starts = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False)
    played = models.BooleanField(default=False)
    objects = TournamentManager()

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=255, default="none")
    tournaments = models.ManyToManyField(Tournament, related_name="teams")

    def __str__(self):
        return self.name


#
#
class Match(models.Model):
    teams = models.ManyToManyField(Team, related_name="matches", null=True, blank=True)
    next_match = models.ForeignKey('Match', unique=False, on_delete=models.CASCADE, related_name='previous_match',
                                   null=True, blank=True)
    status = models.CharField(max_length=31, null=True, blank=True)
    starts = models.DateTimeField(auto_now_add=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, default="none", related_name="matches")

    def get_participants(self):
        arr = list(self.teams.values())
        print(arr)
        if len(arr) == 0:
            return ""
        elif len(arr) == 1:
            return f"{arr[0]['name']}"
        elif len(arr) == 2:
            return f"_{arr[0]['name']}_{arr[1]['name']}"

    def __str__(self):
        return f"{self.tournament.name}_match_id_{self.id}{self.get_participants()}"

    def __repr__(self):  # пока что не нужен
        return {"teams": self.teams, "is_active": self.is_active, "is_played": self.is_played,
                "starts": self.starts,
                "tournament": self.tournament,
                }


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name="players")
    USERNAME_FIELD = 'email'  # что является логином
    REQUIRED_FIELDS = ['name']  # обязательные поля

    def __str__(self):
        return self.email
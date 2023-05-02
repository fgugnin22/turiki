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
    tournaments = models.ManyToManyField(Tournament)

    def __str__(self):
        return self.name


#
#
class Match(models.Model):
    teams = models.ManyToManyField(Team)
    is_active = models.BooleanField(default=False)
    is_played = models.BooleanField(default=False)
    starts = models.DateTimeField(auto_now_add=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, default="none")

    def __str__(self):
        return f"{self.tournament.name}_match_id_{self.id}"


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True)
    USERNAME_FIELD = 'email'  # что является логином
    REQUIRED_FIELDS = ['name']  # обязательные поля

    def __str__(self):
        return self.email

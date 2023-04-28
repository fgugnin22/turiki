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
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'  # что является логином
    REQUIRED_FIELDS = ['name']  # обязательные поля

    def __str__(self):
        return self.email

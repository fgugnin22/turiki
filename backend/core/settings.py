import os
from datetime import timedelta
from pathlib import Path

import psycopg2.extensions
from dotenv import load_dotenv
import redis

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG")

INSTALLED_APPS = [
    "daphne",
    "corsheaders",  # ЭТО СУПЕР ВАЖНО ДЛЯ КОРСА!!! ИНАЧЕ НИЧЕ РАБОТАТЬ НЕ БУДЕТ!
    "django_dramatiq",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "turiki_app",
    "djoser",
    "social_django",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_yasg",
    "django_extensions",
]
# Откуда могут приходить запросы на сервер
ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "core.middleware.StatsMiddleware",
    "social_django.middleware.SocialAuthExceptionMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "core.urls"
CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://localhost:8000", 'https://turiki.tw1.ru']
# html templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "dist")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "social_django.context_processors.backends",
                "social_django.context_processors.login_redirect",
            ],
        },
    },
]
# wsgi - синхронный сервер, asgi - и синхронный и асинхронный
WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}
# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
# Настройка основной DB
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "TurikiCore",
        "USER": os.getenv("PG_USER"),
        "PASSWORD": os.getenv("PG_PASSWORD"),
        "HOST": "pgdb",
        "PORT": "5432",
        "ATOMIC_REQUESTS": True,
        "OPTIONS": {
            "isolation_level": psycopg2.extensions.ISOLATION_LEVEL_SERIALIZABLE,
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
LANGUAGE_CODE = "ru"

TIME_ZONE = "Europe/Moscow"

USE_I18N = True

USE_TZ = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
# настройка статичных файлов (js, html, css, jpg, png и тд)
STATIC_URL = "/assets/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "dist/assets")]
STATIC_ROOT = os.path.join(BASE_DIR, "assets")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "turiki_app.UserAccount"

# настройка почтовой рассылки через мой гугл акк
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = os.getenv('EMAIL_PORT')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True

# настройка DRF
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
# здесь надо доделать настройки simplejwt!(а какие я забыл))
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("JWT",),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}
AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "social_core.backends.discord.DiscordOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)

DJOSER = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "SET_USERNAME_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "email/reset/confirm/{uid}/{token}",
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": True,
    "SOCIAL_AUTH_TOKEN_STRATEGY": "djoser.social.token.jwt.TokenStrategy",
    "SOCIAL_AUTH_ALLOWED_REDIRECT_URIS": [
        "http://localhost:8000",
        "http://localhost:5173",
        "https://turiki.tw1.ru"
    ],
    "SERIALIZERS": {
        "user_create": "turiki_app.serializers.UserSerializer",
        "user": "turiki_app.serializers.UserSerializer",
        "current_user": "turiki_app.serializers.UserSerializer",
        "user_delete": "djoser.serializers.UserDeleteSerializer",
    },
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = (
    os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
)
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
]

SOCIAL_AUTH_DISCORD_KEY = os.getenv("SOCIAL_AUTH_DISCORD_KEY")
SOCIAL_AUTH_DISCORD_SECRET = os.getenv("SOCIAL_AUTH_DISCORD_SECRET")
SOCIAL_AUTH_DISCORD_SCOPE = ["email"]
SOCIAL_AUTH_DISCORD_PROFILE_EXTRA_PARAMS = {"fields": "email"}
SOCIAL_AUTH_DISCORD_GET_ALL_EXTRA_DATA = True

# настройки приложения для рисования графов структур в БД
GRAPH_MODELS = {
    "all_applications": True,
    "group_models": True,
}

# настройки очереди DRAMATIQ
DRAMATIQ_AUTODISCOVER_MODULES = ["tasks", "services"]

DRAMATIQ_BROKER = {
    "BROKER": "dramatiq.brokers.redis.RedisBroker",
    "OPTIONS": {
        "connection_pool": redis.ConnectionPool.from_url("redis://redis:6379"),
    },
    "MIDDLEWARE": [
        "dramatiq.middleware.AgeLimit",
        "dramatiq.middleware.TimeLimit",
        "dramatiq.middleware.Callbacks",
        "django_dramatiq.middleware.DbConnectionsMiddleware",
        "django_dramatiq.middleware.AdminMiddleware",
    ],
}

DRAMATIQ_TASKS_DATABASE = "default"
DRAMATIQ_RESULT_BACKEND = {
    "BACKEND": "dramatiq.results.backends.redis.RedisBackend",
    "BACKEND_OPTIONS": {
        "url": "redis://redis:6379",  # ЕСЛИ не работает заменить урл на redis://localhost:6379, 
        # docker использует внутри себя названия сервисов в качестве доменных имен
    },
    "MIDDLEWARE_OPTIONS": {"result_ttl": 1000 * 60 * 10},
}
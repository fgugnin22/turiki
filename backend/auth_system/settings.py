import os
from datetime import timedelta
from pathlib import Path
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(env_file=os.path.join(BASE_DIR, ".env"))
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Используется для шифрования jwt-токенов -> берется json-payload токена, смешивается шифрованием с этим ключом и получается электронная подпись токена(3 часть)
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

INSTALLED_APPS = [
    "daphne",
    "django_dramatiq",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",  # ЭТО СУПЕР ВАЖНО ДЛЯ КОРСА!!! ИНАЧЕ НИЧЕ РАБОТАТЬ НЕ БУДЕТ!
    "turiki",
    "djoser",
    "social_django",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_yasg",
    "django_extensions",
]
# Откуда могут приходить запросы на сервер
ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True

MIDDLEWARE = [
    "social_django.middleware.SocialAuthExceptionMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # ЭТО СУПЕР ВАЖНО ДЛЯ КОРСА!!! ИНАЧЕ НИЧЕ РАБОТАТЬ НЕ БУДЕТ!
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
# Где находится роутинг для http запросов
ROOT_URLCONF = "auth_system.urls"
# я хз как именно это работает и как взаимодействует с 49-54 строкой
CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://localhost:8000"]
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
WSGI_APPLICATION = "auth_system.wsgi.application"
ASGI_APPLICATION = "auth_system.asgi.application"
# Настройка RedisDB для websocket(нужна для кеширования типа(я его еще не сделал))
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
        "USER": env("PG_USER"),
        "PASSWORD": env("PG_PASSWORD"),
        "HOST": "pgdb",
        "PORT": "5432",
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
# впринципе тут очевидно
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
# тут тоже
LANGUAGE_CODE = "ru"

TIME_ZONE = "UTC"

USE_I18N = True  # эт я хз

USE_TZ = True  # тоже самое

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
# настройка статичных файлов (js, html, css, jpg, png и тд)
STATIC_URL = "/assets/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "dist/assets")]
STATIC_ROOT = os.path.join(BASE_DIR, "assets")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"  # хз

AUTH_USER_MODEL = "turiki.UserAccount"  # модель юзера для авторизации что тут сказать

# настройка почтовой рассылки через мой гугл акк
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
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
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}
AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)
# djoser использует simplejwt для jwt авторизации т.е. библа использует другую библу
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
    ],
    "SERIALIZERS": {
        "user_create": "turiki.serializers.UserSerializer",
        "user": "turiki.serializers.UserSerializer",
        "current_user": "turiki.serializers.UserSerializer",
        "user_delete": "djoser.serializers.UserDeleteSerializer",
    },
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = (
    "469560879923-f4qjktjcuijubkmjaigj6crk0o360hgu.apps.googleusercontent.com"
)

SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "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"
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
]
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ["first_name", "last_name"]

# настройки приложения для рисования графов структур в БД
GRAPH_MODELS = {
    "all_applications": True,
    "group_models": True,
}

# настройки очереди DRAMATIQ
DRAMATIQ_BROKER = {
    "BROKER": "dramatiq.brokers.rabbitmq.RabbitmqBroker",
    "OPTIONS": {
        "host": "rabbit",
        "port": 5672,
        "heartbeat": 0,
        "connection_attempts": 5,
    },
    "MIDDLEWARE": [
        "dramatiq.middleware.Prometheus",
        "dramatiq.middleware.AgeLimit",
        "dramatiq.middleware.TimeLimit",
        "dramatiq.middleware.Callbacks",
        "dramatiq.middleware.Retries",
        "django_dramatiq.middleware.DbConnectionsMiddleware",
        "django_dramatiq.middleware.AdminMiddleware",
    ],
}

# Defines which database should be used to persist Task objects when the
# AdminMiddleware is enabled.  The default value is "default".
DRAMATIQ_TASKS_DATABASE = "default"
DRAMATIQ_RESULT_BACKEND = {
    "BACKEND": "dramatiq.results.backends.redis.RedisBackend",
    "BACKEND_OPTIONS": {
        "url": "redis://redis:6379",  # TODO: ЕСЛИ не работает заменить урл на redis://localhost:6379
    },
    "MIDDLEWARE_OPTIONS": {"result_ttl": 1000 * 60 * 10},
}

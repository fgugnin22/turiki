"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

asgi_app = get_asgi_application()
django.setup()

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.

import turiki_app.routing

application = ProtocolTypeRouter({
    "http": asgi_app,
    "websocket":
        AuthMiddlewareStack(
            URLRouter(
                turiki_app.routing.websocket_urlpatterns
            )
        ),
})

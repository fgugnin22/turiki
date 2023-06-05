from django.urls import re_path

from . import consumers

# url пути для подключения к WS
websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<chat_id>\w+)/$", consumers.ChatConsumer.as_asgi()),
]

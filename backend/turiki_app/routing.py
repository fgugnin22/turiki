from django.urls import re_path

from turiki_app import consumers

# в идеале регекс должен быть ws/chat/(?P<chat_id>[0-9]+)/(\?token=[a-zA-Z0-9.]+)?$
# url пути для подключения к WS
websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<chat_id>[0-9]+)/$", consumers.ChatConsumer.as_asgi()),
]

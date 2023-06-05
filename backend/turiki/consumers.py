from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .models import Message, Chat
from turiki.services import async_return_user, create_message, async_create_message


# noinspection PyBroadException
# consumers - аналог django views для websocket'ов
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Логика в момент подключения к websocket'у
        self.chat_id = int(
            self.scope["url_route"]["kwargs"]["chat_id"])  # заносим id чата из url строки /chat/{chatid}/
        self.chat_id_group_name = f'chat_{self.chat_id}'  # уникальное имя группы для каждого чата
        await self.channel_layer.group_add(
            self.chat_id_group_name, self.channel_name
        )  # добавляем группу в consumer
        token = self.scope["query_string"].decode()[6:]  # достаем токен из query params (?token={token})
        self.scope["user"] = await async_return_user(token)  # подтягиваем объект класса UserAccount
        await self.accept()  # принимаем подключение клиента к websocket'у

    async def receive_json(self, content, **kwargs):
        # ^эта функция отрабатывает когда от клиента приходят запросы по WS
        message = content["message"]  # достаем текст сообщения
        user = self.scope["user"]  # 20 строка
        if user is None:  # если юзера нет или токен был неправильный то ничего дальше не происходит
            return
        msg_instance = await async_create_message(user=user, chat_id=self.chat_id, content=message)
        # ^создаем объект сообщения в бд
        # и отправляем его обратно всей группе(т.е. всем в этом чате)
        await self.channel_layer.group_send(
            self.chat_id_group_name, {
                "type": "chat_message",
                # по значению ключа type отрабатывает одноименная функция в этом классе причем она обязательна
                # т.е. в этом случае значение type - chat_message, отрабатывает функция ниже def chat_message
                "message": {
                    "id": msg_instance.id,
                    "user": msg_instance.user.name,
                    "content": msg_instance.content,
                    "created_at": str(msg_instance.created_at),
                    "chat": msg_instance.chat.id
                },
            }
        )

    async def chat_message(self, event):
        # здесь отсылаем сообщение обратно автору( проверить что будет если убрать из функции всё и оставить голой
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message, "user": self.scope["user"].name}))

    async def disconnect(self, close_code):
        """
        Закрываем соединение с WS
        я не знаю почему
        """
        await self.channel_layer.group_discard(
            self.chat_id_group_name, self.channel_name
        )
        await self.close(code=1231)

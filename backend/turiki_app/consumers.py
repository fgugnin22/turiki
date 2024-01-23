from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from turiki_app.services import async_return_user, async_create_message
import asyncio
from contextlib import suppress



# class Periodic:
#     def __init__(self, func, time):
#         self.func = func
#         self.time = time
#         self.is_started = False
#         self._task = None

#     async def start(self):
#         if not self.is_started:
#             self.is_started = True
#             # Start task to call func periodically:
#             self._task = asyncio.ensure_future(self._run())

#     async def stop(self):
#         if self.is_started:
#             self.is_started = False
#             # Stop task and await it stopped:
#             self._task.cancel()
#             with suppress(asyncio.CancelledError):
#                 await self._task

#     async def _run(self):
#         while True:
#             await asyncio.sleep(self.time)
#             self.func()
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
        if user is None:  # если юзера нет или токен был неправильный, то ничего дальше не происходит
            return
        msg_instance = await async_create_message(user=user, chat_id=self.chat_id, content=message)
        # ^создаем объект сообщения в бд
        # и отправляем его обратно всей группе(т.е. всем в этом чате, кроме, видимо, автора)
        await self.channel_layer.group_send(
            self.chat_id_group_name, {
                "type": content["type"],
                # По значению ключа type отрабатывает одноименная функция в этом классе причем она обязательна
                # т.е. в этом случае значение type - chat_message, отрабатывает функция ниже def chat_message
                # такая функция должна существовать иначе будет ошибка
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
        # здесь отсылаем сообщение обратно автору
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message, "user": self.scope["user"].name}))

    async def disconnect(self, close_code):
        """
        Закрываем соединение с WS
        я не знаю почему, надо
        """
        # await self.channel_layer.group_discard(
        #     self.chat_id_group_name, self.channel_name
        # )
        await self.close(code=1231)

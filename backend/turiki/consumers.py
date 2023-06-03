from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .models import Message, Chat
from turiki.services import return_user, create_message, async_create_message


# noinspection PyBroadException
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.chat_id = int(self.scope["url_route"]["kwargs"]["chat_id"])
        self.chat_id_group_name = f'chat_{self.chat_id}'
        await self.channel_layer.group_add(
            self.chat_id_group_name, self.channel_name
        )
        self.scope["user"] = await return_user(self.scope["query_string"].decode()[6:])
        await self.accept()

    async def receive_json(self, content, **kwargs):
        message = content["message"]
        user = self.scope["user"]
        if user is None:
            return
        {
            "id": 3160,
            "user": "fgugnin",
            "content": "{'message': 'sussy baka'}",
            "created_at": "2023-06-02T10:39:50.907219Z",
            "chat": 1
        },
        msg_instance = await async_create_message(user=user, chat_id=self.chat_id, content=message)
        # Send message to room group
        await self.channel_layer.group_send(
            self.chat_id_group_name, {
                "type": "chat_message",
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
        message = event["message"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "user": self.scope["user"].name}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chat_id_group_name, self.channel_name
        )
        await self.close(code=1231)

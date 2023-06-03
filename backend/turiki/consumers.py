from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .models import Message, Chat
from turiki.services import return_user, create_message, async_create_message


# noinspection PyBroadException
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        headers = self.scope["headers"]
        self.chat_id = int(self.scope["url_route"]["kwargs"]["chat_id"])
        self.chat_id_group_name = f'chat_{self.chat_id}'
        await self.channel_layer.group_add(
            self.chat_id_group_name, self.channel_name
        )
        self.scope["user"] = await return_user(headers)
        await self.accept()
        await self.send(text_data='CONNECTION OPENED!!')

    async def receive_json(self, content, **kwargs):
        message = content["message"]
        user = self.scope["user"]
        if user is None:
            return
        try:
            print("we made it here")
        except:
            return
        await async_create_message(user=user, chat_id=self.chat_id, content=message)
        # Send message to room group
        await self.channel_layer.group_send(
            self.chat_id_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def disconnect(self, close_code):
        print('asdfsf')
        await self.channel_layer.group_discard(
            self.chat_id_group_name, self.channel_name
        )
        await self.close(code=1231)

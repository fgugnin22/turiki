from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

from turiki.services import return_user


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        headers = self.scope["headers"]
        self.scope["user"] = await return_user(headers)
        await self.accept()
        await self.send(text_data='CONNECTION OPENED!!')

    async def receive_json(self, content, **kwargs):
        content = json.dumps(content)
        print(self.scope["user"])
        await self.send(text_data=content)

    async def disconnect(self, close_code):
        print('asdfsf')
        await self.close(code=1231)

import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../shared/rtk/store";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import useWebSocket from "react-use-websocket";
interface chatArgs {
  chatId: number;
  content: string;
}
interface ChatProps {
  chatId: number;
  messages: any[];
  error?: string;
}

const Chat = (props: ChatProps) => {
  const { sendMessage, lastMessage } = useWebSocket(
    `ws://localhost:8000/ws/chat/${props.chatId}/?token=${localStorage.getItem(
      "access"
    )}`,
    {}
  );
  const { userDetails: user, isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  const [message, setMessage] = useState("");
  const onChangeMessage = (e: React.FormEvent) =>
    setMessage((e.target as HTMLInputElement).value);
  const onSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (message.length === 0) {
      return;
    }
    sendMessage(
      JSON.stringify({
        type: "chat_message",
        chatId: props.chatId,
        message
      })
    );
    setMessage("");
  };
  const messagesEndRef = useRef<HTMLElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [messages, setMessages] = useState(props.messages);
  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessages([...messages, JSON.parse(lastMessage.data).message]);
    }
  }, [lastMessage]);
  return (
    <div className=" justify-self-end flex flex-col grow mt-4 max-w-[calc(100%-1rem)] w-96 bg-white shadow-xl rounded-2xl overflow-hidden min-h-[400px] relative">
      <div className="w-full bg-gray-300 text-center py-2">Общий чат</div>
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto scrollbar-none">
        {messages.map((message) => {
          if (message.user === user?.name) {
            return (
              <div
                key={message.id}
                className="flex w-full mt-2 space-x-3 max-w-xs justify-end relative left-9"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 self-end">
                    Вы
                    {message.created_at &&
                      " в " +
                        new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <span className="text-sm float-right text-right break-words max-w-[150px]">
                    {message.content}
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={message.id}
                className="flex w-full mt-3 space-x-3 max-w-xs"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    {message.user}{" "}
                    {message.created_at &&
                      "в " +
                        new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <span className="text-sm float-left text-left break-words max-w-[150px]">
                    {message.content}
                  </span>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef as React.RefObject<HTMLDivElement>}></div>
      </div>
      <form
        className="flex flex-row bg-gray-300 p-2"
        onSubmit={(e: any) => onSubmit(e)}
        noValidate
      >
        <label className="w-full mt-1 mb-0 mr-1 relative" htmlFor="chat">
          <input
            type="text"
            id="chat"
            className="w-full px-2 py-1 text-sm  rounded-md mr-1 border-2 border-slate-500 focus:[&:invalid]:outline-none focus:[&:invalid]:border-red-400"
            value={message}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              onChangeMessage(e)
            }
            required
          />
        </label>
      </form>
    </div>
  );
};

export default Chat;

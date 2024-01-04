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
    <div className=" justify-self-end flex flex-col grow mt-4 max-w-[calc(100%-1rem)] w-96 bg-transparent text-lightgray neonshadowborder rounded-[10px]
    overflow-hidden min-h-[400px] relative z-10">
      <div className="w-full bg-gradient-to-r from-lightblue to-turquoise p-5 text-center text-3xl font-semibold">Общий чат</div>
      <div className="z-10 flex flex-col flex-grow h-0 p-4 overflow-auto scrollbar-none">
        {messages.map((message) => {
          if (message.user === user?.name) {
            return (
              <div
                key={message.id}
                className="flex w-full mt-2 space-x-3 max-w-xs justify-end relative left-9 "
              >
                <div className="flex flex-col">
                  <span className=" text-lightgray self-end filter-none">
                    Вы
                    {message.created_at &&
                      " в " +
                      new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <div className="bg-lightblue text-lightgray rounded-[10px] py-2 px-3 w-fit ml-auto break-words max-w-[160px]">
                    <span>{message.content}</span>
                  </div>
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
                  <span className="text-lightgray">
                    {message.user}{" "}
                    {message.created_at &&
                      "в " +
                      new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <div className="bg-lightblue text-lightgray rounded-[10px] py-2 px-3 w-fit mr-auto break-words max-w-[160px]">
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef as React.RefObject<HTMLDivElement>}></div>
      </div>
      <form
        className="flex flex-row pl-8 pr-5 py-6 z-10"
        onSubmit={(e: any) => onSubmit(e)}
        noValidate
      >
        <label className="w-full relative neonshadow justify-between" htmlFor="chat">
          <input
            type="text"
            id="chat"
            className="w-full px-4 py-3 border-2 border-turquoise text-xl text-turquoise rounded-[10px] focus:outline-none bg-transparent focus:[&:invalid]:outline-none"
            value={message}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              onChangeMessage(e)
            }
            required
          />
        </label>
        <button>
          <svg className="neonshadow ml-1" width="30" viewBox="0 0 45 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_24_86)">
              <path d="M39.7089 25.8956L6.22635 4.33668C5.47088 3.85024 4.50705 4.52951 4.71111 5.40456L8.19849 20.3598C8.26072 20.6267 8.42976 20.8563 8.66609 20.9951L16.973 25.8718C17.6285 26.2566 17.632 27.203 16.9794 27.5927L8.66342 32.5584C8.42874 32.6985 8.26165 32.9286 8.20101 33.1951L4.70208 48.575C4.50222 49.4535 5.47487 50.1276 6.22726 49.6319L39.7176 27.5715C40.3212 27.1738 40.3166 26.2869 39.7089 25.8956Z" fill="#21DBD3" />
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;

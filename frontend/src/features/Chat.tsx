import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../shared/rtk/store";
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
const websocketURL = import.meta.env.VITE_WEBSCOKET_ENDPOINT;

const Chat = (props: ChatProps) => {
  const { sendMessage, lastMessage } = useWebSocket(
    `${websocketURL}/ws/chat/${props.chatId}/?token=${localStorage.getItem(
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
  if (props.messages.length !== messages.length) {
    setMessages(props.messages);
  }
  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessages([...messages, JSON.parse(lastMessage.data).message]);
    }
  }, [lastMessage]);
  return (
    <div
      className="justify-self-end flex flex-col grow mt-4 w-full bg-transparent text-lightgray rounded-[10px]
    overflow-hidden min-h-[400px] relative after:absolute 
    before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
  after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
    before:z-10 z-20 before:bg-dark before:rounded-[8px] 
    before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%]"
    >
      <div className="w-full bg-gradient-to-r from-lightblue z-10 to-turquoise p-3 text-center text-2xl font-semibold">
        Общий чат
      </div>
      <div className="z-10 flex flex-col flex-grow h-0 p-4 overflow-x-scroll scrollbar-none max-w-full">
        {messages.map((message) => {
          if (message.type === "notification") {
            return (
              <div
                key={message.id}
                className="flex w-full mt-2 space-x-3 justify-center relative text-xs font-semibold"
              >
                <div className="border border-lightblue text-lightgray rounded-[10px] py-[5px] px-[7px] w-fit mx-auto break-words">
                  <span>{message.content}</span>
                </div>
              </div>
            );
          }
          if (message.user === user?.name) {
            return (
              <div
                key={message.id}
                className="flex w-full mt-2 space-x-3 justify-end relative text-xs font-semibold"
              >
                <div className="flex flex-col">
                  <span className=" text-lightgray self-end filter-none ext-xs font-medium">
                    Вы
                    {message.created_at &&
                      " в " +
                        new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <div className="bg-lightblue text-lightgray rounded-[10px] py-[5px] px-[7px] w-fit ml-auto break-words max-w-[160px]">
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={message.id + "msg"}
                className="flex w-full mt-3 space-x-3 text-xs font-semibold"
              >
                <div className="flex flex-col">
                  <span className="text-lightgray text-xs font-medium">
                    {message.user}{" "}
                    {message.created_at &&
                      "в " +
                        new Date(message.created_at).toTimeString().slice(0, 5)}
                  </span>
                  <div
                    className={
                      "bg-lightblue text-lightgray rounded-[10px]  py-[5px] px-[7px] w-fit mr-auto break-words max-w-[160px] "
                    }
                  >
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
        className="flex flex-row pl-8 pr-5 pb-5 pt-1 z-10"
        onSubmit={(e: any) => onSubmit(e)}
        noValidate
      >
        <label
          className="w-full relative neonshadow justify-between"
          htmlFor="chat"
        >
          <input
            type="text"
            id="chat"
            className="w-full text-xs font-light px-[10px] py-[10px] border-2 border-turquoise text-turquoise rounded-[10px] focus:outline-none bg-transparent focus:[&:invalid]:outline-none"
            value={message}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              onChangeMessage(e)
            }
            required
          />
        </label>
        <button>
          <svg
            className="neonshadow ml-[10px]"
            width="25"
            viewBox="0 0 45 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_24_86)">
              <path
                d="M39.7089 25.8956L6.22635 4.33668C5.47088 3.85024 4.50705 4.52951 4.71111 5.40456L8.19849 20.3598C8.26072 20.6267 8.42976 20.8563 8.66609 20.9951L16.973 25.8718C17.6285 26.2566 17.632 27.203 16.9794 27.5927L8.66342 32.5584C8.42874 32.6985 8.26165 32.9286 8.20101 33.1951L4.70208 48.575C4.50222 49.4535 5.47487 50.1276 6.22726 49.6319L39.7176 27.5715C40.3212 27.1738 40.3166 26.2869 39.7089 25.8956Z"
                fill="#21DBD3"
              />
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;

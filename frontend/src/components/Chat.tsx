import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import { Link } from "react-router-dom";
interface ChatProps {
    sendMessage: (args) => void;
    chatId: number;
    messages: any[];
    error?: string;
}
const Chat = (props) => {
    const { user, isAuthenticated } = useAppSelector((state: any) => state.user);
    const [message, setMessage] = useState("");
    const onChangeMessage = (e) => setMessage(e.target.value);
    const onSubmit = (e) => {
        e.preventDefault();
        props.sendMessage({
            chatId: props.chatId,
            content: message
        });
        setMessage("");
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [props.messages]);
    return (
        <div className="flex ml-auto mt-auto flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden min-h-[400px] border-2 border-slate-600">
            <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                {props.messages.map((message) => {
                    if (message.user === user?.name) {
                        return (
                            <div
                                key={message.id}
                                className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                            >
                                <div>
                                    <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                        <p className="text-sm">
                                            {message.content}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 leading-none">
                                        2 min ago, you
                                    </span>
                                </div>
                                <Link to={`/`}>
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                </Link>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={message.id}
                                className="flex w-full mt-2 space-x-3 max-w-xs"
                            >
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                <div>
                                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                        <p className="text-sm">
                                            {message.content}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 leading-none">
                                        2 min ago,
                                    </span>
                                    <span className="text-xs text-gray-500 leading-none">
                                        {" "}
                                        {message.user}
                                    </span>
                                </div>
                            </div>
                        );
                    }
                })}
                <div ref={messagesEndRef}></div>
            </div>
            <form
                className="flex flex-row bg-gray-300 p-3"
                onSubmit={(e) => onSubmit(e)}
                noValidate
            >
                <label
                    className="w-[calc(100%-60px)] mt-1 mb-0 mr-1 relative"
                    htmlFor="chat"
                >
                    <input
                        type="text"
                        id="chat"
                        className="w-full px-2 py-2  rounded-md mr-1 border-2 border-slate-500 focus:[&:invalid]:outline-none focus:[&:invalid]:border-red-400"
                        value={message}
                        onChange={(e) => onChangeMessage(e)}
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="w-[50px] px-2 py-1 my-1 rounded-md bg-slate-200 
                    hover:bg-slate-50 transition-colors active:bg-slate-300 box-border border-2 border-slate-500"
                >
                    <svg className="w-[2em] h-[2em]" viewBox="0 0 20 20">
                        <path
                            className="w-[2em] h-[2em] fill-[#000]"
                            fill="none"
                            d="M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0
	l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109
	c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483
	c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788
	S1.293,9.212,1.729,9.212z"
                        ></path>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Chat;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Match = () => {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const params = useParams();
    const {
        data: match,
        isSuccess,
        isFetching,
        isError,
    } = tournamentAPI.useGetMatchByIdQuery({ id: params.id });
    const {
        data: chat,
        isSuccess: isGetMessagesSuccess,
        isError: isGetMessagesError,
    } = tournamentAPI.useGetChatMessagesQuery(
        { chatId: match?.lobby?.chat?.id },
        { skip: isFetching || !match?.lobby }
    );
    const messages = chat?.messages;

    const [message, setMessage] = useState("");
    const onChangeMessage = (e) => setMessage(e.target.value);
    const [
        sendMessage,
        { isSuccess: isSendMessageSuccess, isError: isSendMessageError },
    ] = tournamentAPI.useSendMessageMutation({ skip: message?.length > 0 });
    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage({
            chatId: match?.lobby?.chat?.id,
            content: message,
        });
        setMessage("");
    };
    return (
        <Layout>
            {isSuccess ? (
                <Link to={`/match/${match.id}`}>Match {match.id}</Link>
            ) : null}
            {isSuccess ? (
                <div>
                    {isSuccess && match.participants[0] ? (
                        <Link to={`/team/${match.participants[0].team.id}`}>
                            <div>{match.participants[0].team.name}</div>
                        </Link>
                    ) : (
                        "No"
                    )}
                    {isSuccess && match.participants[1] ? (
                        <Link to={`/team/${match.participants[1].team.id}`}>
                            <div>{match.participants[1].team.name}</div>
                        </Link>
                    ) : (
                        "No"
                    )}
                </div>
            ) : null}
            {isGetMessagesSuccess && isAuthenticated ? (
                <div className="border-4 rounded-xl w-64 h-96 flex flex-col fixed top-20 right-0">
                    <div className="w-full overflow-y-scroll">
                        {messages.map((message) => {
                            let messageClass = "";
                            if (message.user === user?.name) {
                                messageClass = " ml-auto";
                            } else {
                                messageClass = " mr-auto";
                            }
                            return (
                                <div
                                    className={`py-1 border-2 border-blue-300 px-2 rounded-md my-1 w-fit flex flex-row ${messageClass}`}
                                    key={message.id}
                                >
                                    <div>
                                        <p>{message.content}</p>{" "}
                                        <p className=" text-xs font-light">
                                            from {message.user}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form
                        className="flex flex-row"
                        onSubmit={(e) => onSubmit(e)}
                    >
                        <input
                            type="text"
                            className="w-[calc(100%-60px)] px-2 py-1 rounded-md my-1 border-2 border-slate-500 mr-1"
                            value={message}
                            onChange={(e) => onChangeMessage(e)}
                        />
                        <button
                            type="submit"
                            className="w-[50px] mt-auto px-2 py-[6px] rounded-md my-1 bg-slate-200"
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : null}
        </Layout>
    );
};

export default Match;

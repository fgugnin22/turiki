import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Chat from "../components/Chat";
const Match = () => {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const params = useParams();
    const {
        data: match,
        isSuccess,
        isFetching,
        isError
    } = tournamentAPI.useGetMatchByIdQuery({ id: params.id });
    const {
        data: chat,
        isSuccess: isGetMessagesSuccess,
        isError: isGetMessagesError
    } = tournamentAPI.useGetChatMessagesQuery(
        { chatId: match?.lobby?.chat?.id },
        { skip: isFetching || !match?.lobby }
    );
    const messages = chat?.messages;

    const [message, setMessage] = useState("");
    const onChangeMessage = (e) => setMessage(e.target.value);
    const [
        sendMessage,
        { isSuccess: isSendMessageSuccess, isError: isSendMessageError }
    ] = tournamentAPI.useSendMessageMutation({ skip: message?.length > 0 });
    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage({
            chatId: match?.lobby?.chat?.id,
            content: message
        });
        setMessage("");
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);
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
            {isGetMessagesSuccess && isAuthenticated && (
                <Chat
                    messages={messages}
                    chatId={match?.lobby?.chat?.id}
                    sendMessage={sendMessage}
                />
            )}
        </Layout>
    );
};

export default Match;

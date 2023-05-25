import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Chat from "../components/Chat";
import TeamPlayerList from "../components/TeamPlayerList";
const Match = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
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
    const [
        sendMessage,
        { isSuccess: isSendMessageSuccess, isError: isSendMessageError }
    ] = tournamentAPI.useSendMessageMutation({ skip: message?.length > 0 });
    const { data: team1, isSuccess: isTeam1Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[0].team.id, {
            skip: isFetching || !match?.participants[0]?.team
        });
    const { data: team2, isSuccess: isTeam2Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[1].team.id, {
            skip: isFetching || !match?.participants[1]?.team
        });
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
                <div className="m-auto">
                    {isSuccess && match.participants[0] && isTeam1Success && (
                        <TeamPlayerList team={team1} />
                    )}
                    {isSuccess && match.participants[1] && isTeam2Success && (
                        <TeamPlayerList team={team2} />
                    )}
                </div>
            ) : null}
            {isGetMessagesSuccess && isAuthenticated && (
                <Chat
                    messages={messages}
                    chatId={match?.lobby?.chat?.id}
                    sendMessage={sendMessage}
                    error={isGetMessagesError && "message can't be empty"}
                />
            )}
        </Layout>
    );
};

export default Match;

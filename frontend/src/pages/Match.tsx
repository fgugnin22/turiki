import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import Chat from "../components/Chat";
import TeamPlayerList from "../components/TeamPlayerList";
const Match = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
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

    const [
        sendMessage,
        { isSuccess: isSendMessageSuccess, isError: isSendMessageError }
    ] = tournamentAPI.useSendMessageMutation();
    const { data: team1, isSuccess: isTeam1Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[0]?.team.id, {
            skip: isFetching || !match?.participants[0]?.team
        });
    const { data: team2, isSuccess: isTeam2Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[1]?.team.id, {
            skip: isFetching || !match?.participants[1]?.team
        });
    const [claimMatchResult, {}] = tournamentAPI.useClaimMatchResultMutation();
    const starts = new Date(match?.starts);
    let selfParticipant: object;
    let isPlayingThisMatch: boolean;
    if (isSuccess) {
        selfParticipant =
            match?.participants[0]?.team.id === user?.team
                ? match?.participants[0]
                : match?.participants[1];
        isPlayingThisMatch =
            match?.participants[0]?.team.id === user?.team
                ? true
                : match?.participants[1]?.team.id === user?.team
                ? true
                : false;
    }
    return (
        <Layout>
            {isSuccess && (
                <>
                    <div>
                        Match {match.id}
                        <div>
                            {starts.toLocaleDateString().slice(0, -5) +
                                " " +
                                starts.toLocaleTimeString().slice(0, -3)}
                        </div>
                    </div>
                    <div className="m-auto">
                        {isSuccess &&
                            match.participants[0] &&
                            isTeam1Success && <TeamPlayerList team={team1} />}
                        {isSuccess &&
                            match.participants[1] &&
                            isTeam2Success && <TeamPlayerList team={team2} />}
                    </div>
                    {Number(starts) < Number(new Date()) &&
                        match.state === "ACTIVE" &&
                        isPlayingThisMatch &&
                        user.team_status === "CAPTAIN" &&
                        (selfParticipant?.is_winner === null ? (
                            <div>
                                <button
                                    className="p-2 rounded bg-green-400 m-2"
                                    onClick={() =>
                                        claimMatchResult({
                                            isWinner: true,
                                            matchId: match?.id,
                                            participantId: selfParticipant.id
                                        })
                                    }
                                >
                                    Мы падибили!!
                                </button>
                                <button
                                    className="p-2 rounded bg-red-500 m-2"
                                    onClick={() =>
                                        claimMatchResult({
                                            isWinner: false,
                                            matchId: match?.id,
                                            participantId: selfParticipant.id
                                        })
                                    }
                                >
                                    Мы прасрали!!
                                </button>
                                {/* { participantId, isWinner, matchId } */}
                            </div>
                        ) : (
                            <p>Ожидаем ответа от капитана другой команды...</p>
                        ))}
                </>
            )}
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

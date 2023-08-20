import { useParams } from "react-router-dom";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useAppSelector } from "../shared/rtk/store";
import Chat from "../features/Chat";
import TeamPlayerList from "../features/TeamPlayerList";
import MatchResultBar from "../features/MatchResultBar";
import MatchResultVote from "../features/MatchResultVote";
import { Participant } from "../helpers/transformMatches";
import MapBans from "../shared/MapBans";
const Match = () => {
    const { userDetails: user, isAuthenticated } = useAppSelector(
        (state) => state.user
    );
    const params = useParams();
    const {
        data: match,
        isSuccess,
        isFetching,
        isError
    } = tournamentAPI.useGetMatchByIdQuery({ id: params.id! });
    const {
        data: chat,
        isSuccess: isGetMessagesSuccess,
        isError: isGetMessagesError
    } = tournamentAPI.useGetChatMessagesQuery(
        { chatId: match?.lobby?.chat?.id },
        { skip: isFetching || !match?.lobby }
    );
    const messages = chat?.messages;
    const { data: team1, isSuccess: isTeam1Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[0]?.team.id, {
            skip: isFetching || !match?.participants[0]?.team?.id
        });
    const { data: team2, isSuccess: isTeam2Success } =
        tournamentAPI.useGetTeamByIdQuery(match?.participants[1]?.team.id, {
            skip: isFetching || !match?.participants[1]?.team
        });
    const [claimMatchResult, {}] = tournamentAPI.useClaimMatchResultMutation();
    const starts = new Date(match?.starts!);
    let selfParticipant: Participant | null = null;
    if (isSuccess) {
        selfParticipant =
            match?.participants[0]?.team.id === user?.team
                ? match?.participants[0]
                : match?.participants[1]?.team.id === user?.team
                ? match?.participants[1]
                : null;
    }
    const [banMap] = tournamentAPI.useBanMapMutation();
    return (
        <Layout>
            {isSuccess && (
                <div className="flex">
                    <>
                        <MatchResultBar
                            match={match}
                            selfParticipant={selfParticipant}
                        />
                        <div>
                            Match {match.id}
                            {match.bans?.maps.length === 1 && (
                                <span className="text-xl ml-auto block">Карта: {match.bans.maps[0]}</span>
                            )}
                            <div>
                                {starts.toLocaleDateString().slice(0, -5) +
                                    " " +
                                    starts.toLocaleTimeString().slice(0, -3)}
                            </div>
                        </div>
                        <div className="m-auto">
                            {isSuccess &&
                                match.participants[0] &&
                                isTeam1Success && (
                                    <TeamPlayerList team={team1} />
                                )}
                            {isSuccess &&
                                match.participants[1] &&
                                isTeam2Success && (
                                    <TeamPlayerList team={team2} />
                                )}
                        </div>
                        <MatchResultVote
                            starts={starts}
                            isActive={match.state === "ACTIVE"}
                            isCaptain={user?.team_status === "CAPTAIN"}
                            matchId={match?.id}
                            teamId={selfParticipant?.team.id}
                            isWinner={selfParticipant?.is_winner}
                            claimMatchResult={claimMatchResult}
                        />
                    </>
                    {match?.state === "BANS" && (
                        <div className="w-72 m-auto flex flex-col">
                            {match.bans?.maps.map((map) => {
                                const handleBan = () => {
                                    if (!user?.team) {
                                        return;
                                    }
                                    banMap({
                                        teamId: user.team,
                                        matchId: match.id,
                                        mapName: map
                                    });
                                };
                                return (
                                    <div
                                        key={map}
                                        className="w-full p-2 flex items-center justify-center even:text-white even:bg-slate-700 odd:bg-slate-200 odd: text-black"
                                    >
                                        {map}
                                        {(user?.team ===
                                            match.participants[0].team.id ||
                                            user?.team ===
                                                match.participants[1].team
                                                    .id) &&
                                            user?.team_status === "CAPTAIN" &&
                                            match.bans?.previous_team !==
                                                user?.team && (
                                                <button
                                                    onClick={handleBan}
                                                    className="p-1 rounded bg-black text-white ml-auto"
                                                >
                                                    Забанить
                                                </button>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {isGetMessagesSuccess && isAuthenticated && (
                        <Chat
                            messages={messages}
                            chatId={match?.lobby?.chat?.id!}
                        />
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Match;

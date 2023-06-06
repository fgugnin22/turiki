import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { useAppSelector } from "../rtk/store";
import Chat from "../components/Chat";
import TeamPlayerList from "../components/TeamPlayerList";
import MatchResultBar from "../components/MatchResultBar";
import MatchResultVote from "../components/MatchResultVote";
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
    let selfParticipant: any;
    if (isSuccess) {
        selfParticipant =
            match?.participants[0]?.team.id === user?.team
                ? match?.participants[0]
                : match?.participants[1]?.team.id === user?.team
                ? match?.participants[1]
                : null;
    }
    return (
        <Layout>
            {isSuccess && (
                <>
                    {/* <MatchResultBar
                        match={match}
                        selfParticipant={selfParticipant}
                    /> */}
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
                    <MatchResultVote
                        starts={starts}
                        isActive={match.state}
                        isCaptain={user?.team_status === "CAPTAIN"}
                        matchId={match?.id}
                        participantId={selfParticipant?.id}
                        isWinner={selfParticipant?.is_winner}
                        claimMatchResult={claimMatchResult}
                    />
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

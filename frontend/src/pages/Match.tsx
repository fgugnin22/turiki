import { useParams } from "react-router-dom";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useAppSelector, useAppDispatch } from "../shared/rtk/store";
import Chat from "../features/Chat";
import TeamPlayerList from "../features/TeamPlayerList";
import MatchResultBar from "../features/MatchResultBar";
import MatchResultVote from "../features/MatchResultVote";
import { Participant } from "../helpers/transformMatches";
import MapBans from "../shared/MapBans";
import { useCountdown } from "../hooks/useCountDown";
import { useEffect } from "react";
const Match = () => {
  const { userDetails: user, isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  const params = useParams();
  const {
    data: match,
    isSuccess,
    isFetching
  } = tournamentAPI.useGetMatchByIdQuery({ id: params.id! });
  const {
    data: chat,
    isSuccess: isGetMessagesSuccess,
    isError: isGetMessagesError
  } = tournamentAPI.useGetChatMessagesQuery(
    { chatId: match?.lobby?.chat },
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
  const [confirmTeamInLobby] = tournamentAPI.useConfirmTeamInLobbyMutation();
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
  let initialDateSeconds =
    new Date(match?.bans?.timestamps.at(-1) ?? 10).getTime() +
    new Date(
      "01 Jan 1970 " + match?.bans?.time_to_select_map + " GMT" ?? 10
    ).getTime();
  const timeBeforeMatchStart = useCountdown(starts);
  const { seconds } = useCountdown(new Date(initialDateSeconds));
  useEffect(() => {
    if (seconds === -1) {
      dispatch(tournamentAPI.util.invalidateTags(["Match"]));
      console.log("asdfsaf", seconds);
    }
  }, [seconds === -1]);

  return (
    <Layout>
      {isSuccess && (
        <div className="flex">
          <>
            <MatchResultBar match={match} selfParticipant={selfParticipant} />
            <div>
              Match {match.id}
              {match.bans?.maps.length === 1 && (
                <span className="text-xl ml-auto block">
                  Карта: {match.bans.maps[0]}
                </span>
              )}
              {(timeBeforeMatchStart.seconds > 0 ||
                timeBeforeMatchStart.minutes > 0 ||
                timeBeforeMatchStart.hours > 0) && (
                <div>
                  До начала матча осталось: {timeBeforeMatchStart.hours}:
                  {timeBeforeMatchStart.minutes}:{timeBeforeMatchStart.seconds}
                </div>
              )}
            </div>
            <div className="m-auto">
              {isSuccess && match.participants[0] && isTeam1Success && (
                <TeamPlayerList team={team1} />
              )}
              {isSuccess && match.participants[1] && isTeam2Success && (
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

          <MapBans secondsRemaining={seconds} match={match} />
          {isGetMessagesSuccess && isAuthenticated && (
            <Chat messages={messages} chatId={match?.lobby?.chat!} />
          )}
          {match.state === "IN_GAME_LOBBY_CREATION" &&
            user?.team &&
            user.team_status === "CAPTAIN" &&
            !selfParticipant?.in_lobby && (
              <button
                onClick={() =>
                  confirmTeamInLobby({ matchId: match.id, teamId: user?.team })
                }
                className="p-4 bg-green-500"
              >
                Моя команда зашла в лобби
              </button>
            )}
        </div>
      )}
    </Layout>
  );
};

export default Match;

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
  const started = new Date(match?.started!);
  started.setMinutes(started.getMinutes() + 10);
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
  const timeToGetInLobby = useCountdown(started);
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
        <>
          <MatchResultBar match={match} selfParticipant={selfParticipant} />
          <div className="text-center my-4">
            <span className="text-xl ml-auto">
              Матч {match.id}, 1/{2 ** Number(match.name)}
            </span>
            {match.bans?.maps.length === 1 && (
              <span className="ml-4 text-xl">Карта: {match.bans.maps[0]}</span>
            )}
            {(timeBeforeMatchStart.seconds > 0 ||
              timeBeforeMatchStart.minutes > 0 ||
              timeBeforeMatchStart.hours > 0) && (
              <span className="text-xl ml-2">
                До начала матча осталось: {timeBeforeMatchStart.hours}:
                {timeBeforeMatchStart.minutes}:{timeBeforeMatchStart.seconds}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 space-x-4">
            <>
              {isSuccess && match.participants[0] && isTeam1Success && (
                <TeamPlayerList team={team1} />
              )}
              {isSuccess && match.participants[1] && isTeam2Success && (
                <TeamPlayerList team={team2} />
              )}

              <MatchResultVote
                isCompromised={
                  match.participants[0].is_winner === true &&
                  match.participants[1].is_winner === true
                }
                opponentTeamResImage={
                  match.participants[0].id === selfParticipant?.id
                    ? match.participants[1].res_image
                    : match.participants[0].res_image
                }
                selfTeamResImage={selfParticipant?.res_image}
                starts={starts}
                isActive={match.state === "ACTIVE"}
                isCaptain={user?.team_status === "CAPTAIN"}
                matchId={match?.id}
                teamId={selfParticipant?.team.id}
                isWinner={selfParticipant?.is_winner}
                claimMatchResult={claimMatchResult}
                hasOpponentWon={
                  match.participants[0].id === selfParticipant?.id
                    ? match.participants[1].is_winner
                    : match.participants[0].is_winner
                }
              />
              <MapBans secondsRemaining={seconds} match={match} />
            </>

            {match.state === "IN_GAME_LOBBY_CREATION" &&
              user?.team &&
              user.team_status === "CAPTAIN" &&
              !selfParticipant?.in_lobby && (
                <div className="flex w-full flex-col">
                  <p className="text-center mt-4">
                    На заход в лобби осталось: {timeToGetInLobby.minutes}:
                    {timeToGetInLobby.seconds}
                  </p>
                  <button
                    onClick={() =>
                      confirmTeamInLobby({
                        matchId: match.id,
                        teamId: user?.team
                      })
                    }
                    className="py-2 max-h-10 px-4 mx-auto mt-4 max-w-3xl block bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg "
                  >
                    Моя команда зашла в лобби!
                  </button>
                </div>
              )}
            {isGetMessagesSuccess && isAuthenticated && selfParticipant && (
              <Chat messages={messages} chatId={match?.lobby?.chat!} />
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Match;

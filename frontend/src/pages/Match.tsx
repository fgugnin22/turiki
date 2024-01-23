import { useParams } from "react-router-dom";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useAppSelector, useAppDispatch } from "../shared/rtk/store";
import Chat from "../features/Chat";
import TeamPlayerList from "../features/TeamPlayerList";
import MatchResultVote from "../features/MatchResultVote";
import { Participant } from "../helpers/transformMatches";
import MapBans from "../shared/MapBans";
import { useCountdown } from "../hooks/useCountDown";
import { useEffect } from "react";
import ButtonMain from "../shared/ButtonMain";
const serverURL = import.meta.env.VITE_API_URL;
const Match = () => {
  const { userDetails: user, isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  // const dispatch = useAppDispatch();

  const params = useParams();
  const { data: match, isFetching } = tournamentAPI.useGetMatchByIdQuery(
    {
      id: params.id!
    },
    { pollingInterval: 3000 }
  );
  const { data: chat, isSuccess: isChatSuccess } =
    tournamentAPI.useGetChatMessagesQuery(
      { chatId: match?.lobby?.chat },
      { skip: !match?.lobby, pollingInterval: 3000 }
    );

  const messages = chat?.messages;
  const { data: team1 } = tournamentAPI.useGetTeamByIdQuery(
    match?.participants[0]?.team.id,
    {
      skip: isFetching || !match?.participants[0]?.team?.id
    }
  );
  const { data: team2 } = tournamentAPI.useGetTeamByIdQuery(
    match?.participants[1]?.team.id,
    {
      skip: isFetching || !match?.participants[1]?.team
    }
  );
  const [confirmTeamInLobby] = tournamentAPI.useConfirmTeamInLobbyMutation();
  const starts = new Date(match?.starts!);
  const started = new Date(match?.started!);
  started.setMinutes(
    started.getMinutes() + Number(match?.time_results_locked.split(":")[1])
  );
  let selfParticipant: Participant | null = null;
  if (match) {
    selfParticipant =
      match?.participants[0]?.team.id === user?.team
        ? match?.participants[0]
        : match?.participants[1]?.team.id === user?.team
        ? match?.participants[1]
        : null;
  }
  let timeToBan =
    new Date(match?.bans?.timestamps.at(-1) ?? 10).getTime() +
    new Date(
      "01 Jan 1970 " + match?.bans?.time_to_select_map + " GMT" ?? 10
    ).getTime();
  const timeBeforeMatchStart = useCountdown(starts);
  const timeToNextAction = useCountdown(started);
  const { seconds, minutes } = useCountdown(new Date(timeToBan));
  return (
    <Layout>
      {match && (
        <>
          <div className="text-center mt-2 text-2xl">
            <p
              data-content={`Матч ${match.id}, 1/${2 ** Number(match.name)}`}
              className="before:text-2xl before:font-semibold before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 
                            w-full text-center text-2xl before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
            >
              {`Матч ${match.id}, 1/${2 ** Number(match.name)}`}
            </p>
            {selfParticipant?.is_winner !== undefined &&
              selfParticipant?.is_winner !== null && (
                <p
                  data-content={`${
                    selfParticipant?.is_winner
                      ? "Ваша команда выиграла!"
                      : "Ваша команда проиграла!"
                  }`}
                  className="before:text-[20px] before:font-medium  before:inset-0 
                            w-full text-center text-[20px] before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                >
                  {`${
                    selfParticipant?.is_winner
                      ? "Ваша команда выиграла!"
                      : "Ваша команда проиграла!"
                  }`}
                </p>
              )}
            {(match.bans?.maps.length === 1 ? (
              <p className="text-lg font-normal text-lightgray">
                Карта:{" "}
                <span
                  data-content={match.bans.maps[0]}
                  className="before:text-lg before:-top-[3px] before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                >
                  {match.bans.maps[0]}
                </span>
              </p>
            ) : match?.state === "SCORE_DONE" ? (
              ""
            ) : (
              ""
            )) ||
              ((timeBeforeMatchStart.seconds > 0 ||
                timeBeforeMatchStart.minutes > 0 ||
                timeBeforeMatchStart.hours > 0) && (
                <p className="text-lg font-normal text-lightgray mb-4">
                  <span>До начала матча осталось: </span>
                  <span
                    data-content={`${
                      timeBeforeMatchStart.hours > 9
                        ? timeBeforeMatchStart.hours
                        : "0" + timeBeforeMatchStart.hours
                    }:${
                      timeBeforeMatchStart.minutes > 9
                        ? timeBeforeMatchStart.minutes
                        : "0" + timeBeforeMatchStart.minutes
                    }:${
                      timeBeforeMatchStart.seconds > 9
                        ? timeBeforeMatchStart.seconds
                        : "0" + timeBeforeMatchStart.seconds
                    }`}
                    className="before:text-lg before:-top-[3px] before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
          before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
            before:absolute relative before:content-[attr(data-content)]"
                  >
                    {`${
                      timeBeforeMatchStart.hours > 9
                        ? timeBeforeMatchStart.hours
                        : "0" + timeBeforeMatchStart.hours
                    }:${
                      timeBeforeMatchStart.minutes > 9
                        ? timeBeforeMatchStart.minutes
                        : "0" + timeBeforeMatchStart.minutes
                    }:${
                      timeBeforeMatchStart.seconds > 9
                        ? timeBeforeMatchStart.seconds
                        : "0" + timeBeforeMatchStart.seconds
                    }`}
                  </span>
                </p>
              ))}
          </div>
          <div className="grid grid-cols-2 justify-center gap-x-[140px] relative mt-8">
            <img
              src={`${serverURL}/assets/img/versus.svg`}
              className="absolute z-50 top-[65px] left-[calc(50%-25px)]"
            />
            <>
              {match && match.participants[0] && team1 && (
                <TeamPlayerList tournamentId={match.tournament!} team={team1} />
              )}
              {match && match.participants[1] && team2 && (
                <TeamPlayerList tournamentId={match.tournament!} team={team2} />
              )}

              {match?.state === "RES_SEND_LOCKED" &&
              timeToNextAction.minutes < 0 &&
              timeToNextAction.seconds < 0 ? (
                <MatchResultVote
                  selfParticipant={selfParticipant!}
                  match={match}
                  isCaptain={user?.team_status === "CAPTAIN"}
                  teamId={selfParticipant?.team.id}
                />
              ) : (
                match?.state === "RES_SEND_LOCKED" && (
                  <div className="text-center mt-8 text-lg">
                    <span>Результаты можно будет опубликовать через: </span>
                    <p
                      data-content={`${
                        timeToNextAction.minutes > 9
                          ? timeToNextAction.minutes
                          : "0" + timeToNextAction.minutes
                      }:${
                        timeToNextAction.seconds > 9
                          ? timeToNextAction.seconds
                          : "0" + timeToNextAction.seconds
                      }`}
                      className="before:text-lg before:font-medium before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 
                             text-lg font-medium  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] z-50"
                    >
                      {`${
                        timeToNextAction.minutes > 9
                          ? timeToNextAction.minutes
                          : "0" + timeToNextAction.minutes
                      }:${
                        timeToNextAction.seconds > 9
                          ? timeToNextAction.seconds
                          : "0" + timeToNextAction.seconds
                      }`}
                    </p>
                  </div>
                )
              )}
              {match?.state === "BANS" && (
                <>
                  <div></div>
                  <MapBans
                    secondsRemaining={minutes * 60 + seconds}
                    match={match}
                  />
                </>
              )}
            </>
            {match.state === "IN_GAME_LOBBY_CREATION" &&
              user?.team === selfParticipant?.team.id &&
              user?.team_status === "CAPTAIN" && (
                <div className="flex w-4/5 mx-auto flex-col mt-14 relative">
                  <p className="text-center mb-4">
                    {!selfParticipant?.in_lobby
                      ? `На заход в лобби осталось: ${timeToNextAction.minutes}:
                    ${
                      timeToNextAction.seconds > 9
                        ? timeToNextAction.seconds
                        : "0" + timeToNextAction.seconds
                    }`
                      : "Ваша команда уже в лобби"}
                  </p>
                  <ButtonMain
                    disabled={selfParticipant?.in_lobby}
                    onClick={() => {
                      confirmTeamInLobby({
                        matchId: match.id,
                        teamId: user.team
                      });
                    }}
                    className="py-4 w-full focus:py-[14px] active:py-[14px] text-center disabled:opacity-60"
                  >
                    Моя команда зашла в лобби!
                  </ButtonMain>
                </div>
              )}
            {match?.state === "SCORE_DONE" && <div className=""></div>}
            {((user?.is_staff && isChatSuccess) ||
              (isChatSuccess && isAuthenticated && selfParticipant)) && (
              <Chat messages={messages} chatId={match?.lobby?.chat!} />
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Match;

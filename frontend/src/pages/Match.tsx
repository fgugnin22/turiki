import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useAppSelector } from "../shared/rtk/store";
import Chat from "../features/Chat";
import TeamPlayerList from "../features/TeamPlayerList";
import MatchResultVote from "../features/MatchResultVote";
import { Participant } from "../helpers/transformMatches";
import MapBans from "../shared/MapBans";
import { useCountdown } from "../hooks/useCountDown";
import ButtonMain from "../shared/ButtonMain";
import { ROUTES } from "../shared/RouteTypes";
import AdminChat from "../features/AdminChat";
import { useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";

const serverURL = import.meta.env.VITE_API_URL;

const Match = () => {
  const { userDetails: user, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  const params = useParams();

  const [showChat, setShowChat] = useState(document.body.clientWidth > 900);

  const {
    data: match,
    isFetching,
    isError
  } = tournamentAPI.useGetMatchByIdQuery(
    {
      id: params.id!
    },
    { pollingInterval: 5000 }
  );

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
  const starts = new Date(match?.starts! ?? 0);
  const started = new Date(match?.started!);
  started.setMinutes(
    started.getMinutes() +
      Number(
        match?.state === "RES_SEND_LOCKED"
          ? match.time_results_locked.split(":")[1]
          : match?.state === "IN_GAME_LOBBY_CREATION"
          ? match.time_to_enter_lobby.split(":")[1]
          : 0
      )
  );
  started.setSeconds(
    started.getSeconds() + Number(match?.time_results_locked.split(":")[2])
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

  const timeB4MatchStartsStr = `${
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
  }`;

  const timeB4PublishResStr =
    timeToNextAction.seconds >= 0 &&
    timeToNextAction.minutes >= 0 &&
    !timeToNextAction.isInThePast
      ? `${
          timeToNextAction.minutes > 9
            ? timeToNextAction.minutes
            : "0" + timeToNextAction.minutes
        }:${
          timeToNextAction.seconds > 9
            ? timeToNextAction.seconds
            : "0" + timeToNextAction.seconds
        }`
      : "...";

  const { seconds, minutes } = useCountdown(new Date(timeToBan));

  const insideLobbyStr = !selfParticipant?.in_lobby
    ? `На заход в лобби осталось: ${
        timeToNextAction.isInThePast
          ? "..."
          : `${timeToNextAction.minutes}:${
              timeToNextAction.seconds > 9
                ? timeToNextAction.seconds
                : "0" + timeToNextAction.seconds
            }`
      }`
    : "Ваша команда уже в лобби";

  const windowSize = useWindowSize();

  const isFirstTeamWinner =
    match?.participants[0]?.is_winner &&
    match.participants[1]?.is_winner === false;

  const isSecondTeamWinner =
    match?.participants[1]?.is_winner &&
    match.participants[0]?.is_winner === false;

  useEffect(() => {
    setShowChat(windowSize.width > 900);
  }, [windowSize.width]);

  if (isError) {
    navigate(ROUTES.NO_MATCH404.path);
  }

  return (
    <Layout>
      {match && (
        <>
          {((match.state !== "NO_SHOW" && selfParticipant) ||
            user?.is_staff) && (
            <button
              onClick={() => setShowChat((p) => !p)}
              className="fixed bottom-4 right-4 lg:hidden"
            >
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="22.5"
                  cy="22.5"
                  r="22.5"
                  fill="url(#paint0_linear_786_1002)"
                />
                <path
                  d="M32.3813 26.8627C32.9711 25.5285 33.2987 24.0525 33.2987 22.4999C33.2987 16.5353 28.4634 11.7 22.4987 11.7C16.5341 11.7 11.6987 16.5353 11.6987 22.4999C11.6987 28.4646 16.5341 33.2999 22.4987 33.2999C24.4191 33.2999 26.2224 32.7987 27.785 31.92L33.3008 33.2989L32.3813 26.8627Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_786_1002"
                    x1="45"
                    y1="0"
                    x2="5.36442e-06"
                    y2="45"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#18A3DC" />
                    <stop offset="1" stopColor="#21DBD3" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          )}
          <div className="text-center mt-2 text-2xl relative">
            <div className="flex flex-col-reverse sm:flex-row">
              <Link
                className="text-lg hover:underline block"
                to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.BRACKET.buildPath({
                  id: match.tournament ?? -1
                })}
              >
                Перейти к турнирной сетке
              </Link>
              <p
                data-content={`Матч 1/${2 ** Number(match.name)}, Best of ${
                  match.is_bo3 ? "3" : "1"
                }${match.is_bo3 ? `, ${match.bo3_order + 1}/3` : ""}`}
                className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent text-2xl font-extrabold
                sm:absolute sm:left-1/2 sm:-translate-x-1/2"
              >
                {`Матч 1/${2 ** Number(match.name)}, Best of ${
                  match.is_bo3 ? "3" : "1"
                }${match.is_bo3 ? `, ${match.bo3_order + 1}/3` : ""}`}
              </p>
            </div>

            {match.participants.length === 1 && match.state === "NO_SHOW" && (
              <p className="text-lightgray text-xl">Ожидается соперник...</p>
            )}
            {(selfParticipant?.is_winner ?? false) &&
              match.participants[0]?.is_winner !==
                match.participants[1]?.is_winner &&
              match.participants.every((p) => p.is_winner !== null) && (
                <p
                  data-content={`${
                    selfParticipant?.is_winner
                      ? "Ваша команда выиграла!"
                      : "Ваша команда проиграла!"
                  }`}
                  className="before:text-[20px] before:font-medium  before:top-0 before:bottom-0 before:left-0 before:right-0 
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
            {(match.current_map ? (
              <p className="text-lg font-normal text-lightgray">
                Карта:{" "}
                <span
                  data-content={match.current_map}
                  className="before:text-lg before:-top-[2px] before:drop-shadow-[0_0_1px_#4cf2f8]before:bottom-0 before:left-0 before:right-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                >
                  {match.current_map}
                </span>
              </p>
            ) : match?.state === "SCORE_DONE" ? (
              ""
            ) : (
              ""
            )) ||
              (!timeBeforeMatchStart.isInThePast && (
                <p className="text-sm lg:text-lg font-normal text-lightgray mb-4">
                  <span>До начала матча осталось: </span>
                  <span
                    data-content={timeB4MatchStartsStr}
                    className="before:text-lg before:drop-shadow-[0_0_1px_#4cf2f8] before:-top-[2px] before:bottom-0 before:left-0 before:right-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
          before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
            before:absolute relative before:content-[attr(data-content)]"
                  >
                    {timeB4MatchStartsStr}
                  </span>
                </p>
              ))}
          </div>
          <div className="grid grid-cols-2 justify-center gap-x-[33px] lg:gap-x-[140px] relative mt-4">
            <img
              src={`${serverURL}/media/img/versus.svg`}
              className="absolute z-50 top-[24px] lg:top-[65px] left-1/2 -translate-x-1/2 w-[20px] lg:w-[50px]"
            />
            <>
              {match && match.participants[0] && team1 && (
                <TeamPlayerList
                  isWinner={isFirstTeamWinner ?? false}
                  tournamentId={match.tournament!}
                  team={team1}
                />
              )}
              {match && match.participants[1] && team2 && (
                <TeamPlayerList
                  isWinner={isSecondTeamWinner ?? false}
                  tournamentId={match.tournament!}
                  team={team2}
                />
              )}
              {match.participants.length == 1 && (
                <div className="order-1"></div>
              )}
              <div className="order-1 lg:col-span-1 col-span-2">
                {match?.state === "ACTIVE" || match?.state === "CONTESTED" ? (
                  <MatchResultVote
                    selfParticipant={selfParticipant!}
                    match={match}
                    isCaptain={user?.team_status === "CAPTAIN"}
                    teamId={selfParticipant?.team.id}
                  />
                ) : (
                  match?.state === "RES_SEND_LOCKED" && (
                    <div className="text-center mt-8 text-lg leading-6">
                      <span>Результаты можно будет опубликовать через: </span>
                      <p
                        data-content={timeB4PublishResStr}
                        className="before:text-lg  before:font-medium before:drop-shadow-[0_0_1px_#4cf2f8] before:top-0 before:bottom-0 before:left-0 before:right-0 
                             text-lg font-medium  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] z-50"
                      >
                        {timeB4PublishResStr}
                      </p>
                    </div>
                  )
                )}
                {match?.state == "BANS" && (
                  <MapBans
                    secondsRemaining={minutes * 60 + seconds}
                    match={match}
                  />
                )}
                {match?.state === "SCORE_DONE" &&
                  match.next_match &&
                  selfParticipant?.is_winner == true && (
                    <Link
                      className="flex items-center w-full mt-12"
                      to={ROUTES.MATCHES.MATCH_BY_ID.buildPath({
                        id: match.next_match
                      })}
                    >
                      <ButtonMain className="mx-auto font-medium">
                        {match.is_next_match_a_map
                          ? "Перейти к следующей карте"
                          : "Перейти к следующему матчу!"}
                      </ButtonMain>
                    </Link>
                  )}
                {match.state === "IN_GAME_LOBBY_CREATION" &&
                user?.team === selfParticipant?.team.id &&
                user?.team_status === "CAPTAIN" ? (
                  <div className="order-1 flex w-4/5 mx-auto flex-col mt-14 relative">
                    <p className="text-center mb-4">
                      {!selfParticipant?.in_lobby
                        ? insideLobbyStr
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
                      className="py-4 font-medium px-0 w-full focus:py-[14px] active:py-[14px] text-center disabled:opacity-60"
                    >
                      Моя команда зашла в лобби!
                    </ButtonMain>
                  </div>
                ) : (
                  <></>
                )}{" "}
              </div>
              {match.state !== "NO_SHOW" &&
                match.participants.length == 2 &&
                (!user?.is_staff
                  ? isAuthenticated &&
                    selfParticipant &&
                    showChat && (
                      <Chat
                        teamId={selfParticipant?.team.id ?? -1}
                        lobby={match.lobby}
                      />
                    )
                  : isAuthenticated &&
                    match.participants.length == 2 &&
                    selfParticipant &&
                    showChat && (
                      <AdminChat
                        lobby={match.lobby}
                        teams={match.participants.map((p) => p.team)}
                      />
                    ))}
            </>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Match;

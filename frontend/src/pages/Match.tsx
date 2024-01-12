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
const serverURL = import.meta.env.VITE_API_URL;

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
    const [confirmTeamInLobby] = tournamentAPI.useConfirmTeamInLobbyMutation();
    const starts = new Date(match?.starts!);
    const started = new Date(match?.started!);
    started.setMinutes(
        started.getMinutes() + Number(match?.time_results_locked.split(":")[1])
    );
    let selfParticipant: Participant | null = null;
    if (isSuccess) {
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
    const { seconds } = useCountdown(new Date(timeToBan));
    // useEffect(() => {
    //   if (seconds === -1 || seconds % 10 === 1) {
    //     dispatch(tournamentAPI.util.invalidateTags(["Match"]));
    //   }
    // }, [seconds]);
    // useEffect(() => {
    //   if (timeBeforeMatchStart.seconds === -1) {
    //     dispatch(tournamentAPI.util.invalidateTags(["Match"]));
    //   }
    // }, [timeBeforeMatchStart.seconds]);
    return (
        <Layout>
            {isSuccess && (
                <>
                    {/* <MatchResultBar
                        match={match}
                        selfParticipant={selfParticipant}
                    /> */}
                    <div className="text-center mt-12 text-2xl">
                        <p
                            data-content={`Матч ${match.id}, 1/${
                                2 ** Number(match.name)
                            }`}
                            className="before:text-2xl before:font-semibold before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 
                            w-full text-center text-2xl before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                        >
                            {`Матч ${match.id}, 1/${2 ** Number(match.name)}`}
                        </p>
                        {(match.bans?.maps.length === 1 && (
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
                                                : "0" +
                                                  timeBeforeMatchStart.hours
                                        }:${
                                            timeBeforeMatchStart.minutes > 9
                                                ? timeBeforeMatchStart.minutes
                                                : "0" +
                                                  timeBeforeMatchStart.minutes
                                        }:${
                                            timeBeforeMatchStart.seconds > 9
                                                ? timeBeforeMatchStart.seconds
                                                : "0" +
                                                  timeBeforeMatchStart.seconds
                                        }`}
                                        className="before:text-lg before:-top-[3px] before:drop-shadow-[0_0_1px_#4cf2f8] before:inset-0 w-full text-center text-lg before:w-full before:text-center before:bg-gradient-to-l 
          before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
            before:absolute relative before:content-[attr(data-content)]"
                                    >
                                        {`${
                                            timeBeforeMatchStart.hours > 9
                                                ? timeBeforeMatchStart.hours
                                                : "0" +
                                                  timeBeforeMatchStart.hours
                                        }:${
                                            timeBeforeMatchStart.minutes > 9
                                                ? timeBeforeMatchStart.minutes
                                                : "0" +
                                                  timeBeforeMatchStart.minutes
                                        }:${
                                            timeBeforeMatchStart.seconds > 9
                                                ? timeBeforeMatchStart.seconds
                                                : "0" +
                                                  timeBeforeMatchStart.seconds
                                        }`}
                                    </span>
                                </p>
                            ))}
                    </div>
                    <div className="grid grid-cols-2 justify-center gap-x-[140px] relative">
                        <img
                            src={`${serverURL}/assets/img/versus.svg`}
                            className="absolute z-50 top-[calc(50%-27px)] left-[calc(50%-25px)]"
                        />
                        <>
                            {isSuccess &&
                                match.participants[0] &&
                                isTeam1Success && (
                                    <TeamPlayerList
                                        match={match}
                                        team={team1}
                                    />
                                )}
                            {isSuccess &&
                                match.participants[1] &&
                                isTeam2Success && (
                                    <TeamPlayerList
                                        match={match}
                                        team={team2}
                                    />
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
                                        До разблокировки отправки результатов
                                        осталось: {timeToNextAction.minutes}:
                                        {timeToNextAction.seconds > 9
                                            ? timeToNextAction.seconds
                                            : `0${timeToNextAction.seconds}`}
                                    </div>
                                )
                            )}
                            {match?.state === "BANS" && (
                                <>
                                    <div></div>
                                    <MapBans
                                        secondsRemaining={seconds}
                                        match={match}
                                    />
                                </>
                            )}
                        </>
                        {match.state === "IN_GAME_LOBBY_CREATION" &&
                            user?.team &&
                            user.team_status === "CAPTAIN" &&
                            selfParticipant?.in_lobby && <div></div>}
                        {match.state === "IN_GAME_LOBBY_CREATION" &&
                            user?.team === selfParticipant?.team.id &&
                            user?.team_status === "CAPTAIN" &&
                            !selfParticipant?.in_lobby && (
                                <div className="flex w-full flex-col">
                                    <p className="text-center mt-4">
                                        На заход в лобби осталось:{" "}
                                        {timeToNextAction.minutes}:
                                        {timeToNextAction.seconds > 9
                                            ? timeToNextAction.seconds
                                            : "0" + timeToNextAction.seconds}
                                    </p>
                                    <button
                                        onClick={() =>
                                            confirmTeamInLobby({
                                                matchId: match.id,
                                                teamId: user.team
                                            })
                                        }
                                        className="py-2 max-h-10 px-4 mx-auto mt-4 max-w-3xl block bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg "
                                    >
                                        Моя команда зашла в лобби!
                                    </button>
                                </div>
                            )}
                        {match?.state === "SCORE_DONE" && (
                            <div className=""></div>
                        )}
                        {((user?.is_staff && isGetMessagesSuccess) ||
                            (isGetMessagesSuccess &&
                                isAuthenticated &&
                                selfParticipant)) && (
                            <Chat
                                messages={messages}
                                chatId={match?.lobby?.chat!}
                            />
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
};

export default Match;

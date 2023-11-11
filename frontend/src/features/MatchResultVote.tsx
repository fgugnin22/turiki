import { Match, Match2, Participant } from "../helpers/transformMatches";
import { useCountdown } from "../hooks/useCountDown";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { uploadMatchResultImage } from "../shared/rtk/user";
const serverURL = import.meta.env.VITE_API_URL;

interface MatchResultVoteProps {
  isCaptain: Boolean;
  teamId: number | undefined;
  match: Match;
  selfParticipant: Participant;
}

const MatchResultVote = (props: MatchResultVoteProps) => {
  const { userDetails } = useAppSelector((state) => state.user);
  const [claimMatchResult, {}] = tournamentAPI.useClaimMatchResultMutation();

  const dispatch = useAppDispatch();
  if (!props.teamId) {
    return <></>;
  }
  const onImageSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    if (!target.files || !props.teamId) {
      return;
    }
    const formData = new FormData();
    formData.append("image", target.files[0]);
    console.log(target.files[0]);
    await dispatch(
      uploadMatchResultImage({ formData, matchId: props.match.id })
    );
    window.location.reload();
  };
  if (
    props.match.participants[0].is_winner === true &&
    props.match.participants[1].is_winner === true
  ) {
    return (
      <h2 className="text-2xl text-red-600 text-center mt-8">
        Результат оспорен командой противника, администратор скоро прибудет
      </h2>
    );
  }
  const hasOpponentWon =
    props.match.participants[0].id === props.selfParticipant?.id
      ? props.match.participants[1].is_winner
      : props.match.participants[0].is_winner;
  const selfResImage = props.selfParticipant?.res_image;
  const vsParticipant =
    props.match.participants[0].id === props.selfParticipant?.id
      ? props.match.participants[1]
      : props.match.participants[0];
  const opponentTeamResImage = vsParticipant?.res_image;
  const isWinner = props.selfParticipant?.is_winner;
  let timeBeforeAutoRes: any = new Date(props.match?.first_result_claimed);
  timeBeforeAutoRes.setMinutes(
    timeBeforeAutoRes.getMinutes() +
      Number(props.match?.time_to_confirm_results.split(":")[1])
  );
  timeBeforeAutoRes = useCountdown(timeBeforeAutoRes);
  return (
    <>
      {props.teamId === userDetails?.team &&
        props.match.state === "RES_SEND_LOCKED" &&
        props.isCaptain && (
          <div className=" text-center">
            <h3 className="text-xl mt-8">
              Перед отправкой результата прикрепите скрин из игры!{" "}
            </h3>
            {props.selfParticipant.is_winner === true &&
              (vsParticipant.is_winner ?? true) && (
                <p>
                  Результаты выставятся автоматически через{" "}
                  {timeBeforeAutoRes.minutes}:
                  {timeBeforeAutoRes.seconds > 9
                    ? timeBeforeAutoRes.seconds
                    : `0${timeBeforeAutoRes.seconds}`}{" "}
                </p>
              )}
            {/* {props.} */}
            {(isWinner === null || isWinner === undefined) && (
              <div className="mt-4">
                <button
                  className={`py-2 px-3  ${
                    hasOpponentWon ? "bg-yellow-600" : "bg-green-600"
                  }
                  ${
                    hasOpponentWon
                      ? "hover:bg-yellow-700"
                      : "hover:bg-green-700"
                  } ${
                    hasOpponentWon
                      ? "focus:bg-yellow-500"
                      : "focus:ring-green-500"
                  }  ${
                    hasOpponentWon
                      ? " focus:ring-offset-yellow-200"
                      : " focus:ring-offset-green-200"
                  }
                   text-white w-48 mt-4 transition ease-in duration-200 text-center text-sm
                    font-semibold shadow-md focus:outline-none
                    focus:ring-2 focus:ring-offset-2  rounded-lg`}
                  onClick={() =>
                    claimMatchResult({
                      isWinner: true,
                      matchId: props.match.id,
                      teamId: props.teamId ?? 0
                    })
                  }
                >
                  {hasOpponentWon
                    ? "Оспорить результат"
                    : "Моя команда выиграла"}
                </button>
                <button
                  className=" ml-8 py-2 px-3  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-48 mt-4 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  onClick={() =>
                    claimMatchResult({
                      isWinner: false,
                      matchId: props.match.id,
                      teamId: props.teamId ?? 0
                    })
                  }
                >
                  Моя команда проиграла
                </button>
              </div>
            )}
            {!selfResImage && (
              <>
                <label
                  className="py-2 px-3 mt-4 inline-block bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-48 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  htmlFor="file_input"
                >
                  Прикрепить результат
                </label>
                <input
                  onChange={onImageSubmit}
                  id="file_input"
                  type="file"
                  accept="image/png"
                  hidden
                />
              </>
            )}
            {selfResImage && (
              <a
                className="py-2 px-3 mt-4 inline-block bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-48 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                href={`${serverURL}/${selfResImage}`}
                target="_blank"
              >
                Свой результат
              </a>
            )}
            {opponentTeamResImage && (
              <a
                className=" ml-8 py-2 px-3 mt-4 inline-block bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-48 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                href={`${serverURL}/${opponentTeamResImage}`}
              >
                Результат оппонентов
              </a>
            )}
          </div>
        )}
    </>
  );
};

export default MatchResultVote;

import { useState } from "react";
import { Match, Match2, Participant } from "../helpers/transformMatches";
import { useCountdown } from "../hooks/useCountDown";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { uploadMatchResultImage } from "../shared/rtk/user";
import RadioTrue from "../shared/RadioTrue";
import RadioFalse from "../shared/RadioFalse";
import ButtonMain from "../shared/ButtonMain";
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
  const [result, setResult] = useState<"won" | "lost" | undefined>(undefined);
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
          <div className=" text-center mt-14">
            {!selfResImage && (
              <p
                data-content={`Перед отправкой результата прикрепите скрин из игры!`}
                className="before:text-[20px] before:font-semibold before:inset-0 
                             text-[20px] font-semibold  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] z-50"
              >
                {`Перед отправкой результата прикрепите скрин из игры!`}
              </p>
            )}
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
            {
              (isWinner === null || isWinner === undefined) && null
              // <div className="mt-4">
              //   <button
              //     className={``}
              //     onClick={() =>
              //       claimMatchResult({
              //         isWinner: true,
              //         matchId: props.match.id,
              //         teamId: props.teamId ?? 0
              //       }).unwrap()
              //     }
              //   >
              //     {hasOpponentWon
              //       ? "Оспорить результат"
              //       : "Моя команда выиграла"}
              //   </button>
              //   <button
              //     className=" ml-8 py-2 px-3  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-48 mt-4 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
              // onClick={() =>
              //   claimMatchResult({
              //     isWinner: false,
              //     matchId: props.match.id,
              //     teamId: props.teamId ?? 0
              //   })
              // }
              //   >
              //     Моя команда проиграла
              //   </button>
              // </div>
            }
            <div className="flex gap-10 justify-evenly mt-10">
              {!selfResImage ? (
                <label
                  className="hover:drop-shadow-[0_0_2px_#4cf2f8] transition duration-300"
                  htmlFor="file_input"
                >
                  <img
                    className="w-[200px]"
                    src={serverURL + "/assets/img/uploadimg.svg"}
                    alt=""
                  />
                </label>
              ) : (
                <img
                  className="w-[200px] rounded-[10px]"
                  src={`${serverURL}/${props.selfParticipant.res_image}`}
                />
              )}
              <input
                onChange={onImageSubmit}
                id="file_input"
                type="file"
                accept="image/png"
                hidden
              />
              {props.selfParticipant.is_winner === undefined && (
                <div className="flex flex-col justify-center gap-10 items-start">
                  <div>
                    <input
                      hidden
                      type="radio"
                      name="result"
                      value={1}
                      onChange={() => setResult("won")}
                      id="radiowon"
                    />
                    <label className="flex w-full" htmlFor="radiowon">
                      {result === "won" ? <RadioTrue /> : <RadioFalse />}
                      <p
                        data-content={`Победа`}
                        className="before:text-[20px] grow text-left ml-5 before:w-full before:font-medium before:inset-0 
                             text-[20px] font-medium  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] w-[calc(100%-52px)] z-50"
                      >
                        {`Победа`}
                      </p>
                    </label>
                  </div>
                  <div className="">
                    <input
                      hidden
                      type="radio"
                      name="result"
                      value={0}
                      onChange={() => setResult("lost")}
                      id="radiolost"
                    />
                    <label className="flex w-full" htmlFor="radiolost">
                      {result === "lost" ? <RadioTrue /> : <RadioFalse />}
                      <p
                        data-content={`Поражение`}
                        className="before:text-[20px] grow text-left ml-5 before:w-full before:font-medium before:inset-0 
                             text-[20px] font-medium  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] w-[calc(100%-52px)] z-50"
                      >
                        {`Поражение`}
                      </p>
                    </label>
                  </div>
                </div>
              )}
            </div>
            <ButtonMain
              onClick={() => {
                if (result === undefined) {
                  return;
                }
                claimMatchResult({
                  isWinner: result === "won" ? true : false,
                  matchId: props.match.id,
                  teamId: props.teamId ?? 0
                });
              }}
              className="py-4 px-8 focus:py-[14px] focus:px-[30px] active:py-[14px] active:px-[30px] mt-12 text-lg"
            >
              Отправить результат
            </ButtonMain>
            {/* {selfResImage && (
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
            )} */}
          </div>
        )}
    </>
  );
};

export default MatchResultVote;

import { useState } from "react";
import { Match, Participant } from "../helpers/transformMatches";
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
  const dispatch = useAppDispatch();

  const team = useAppSelector((state) => state.user.userDetails?.team);

  const [claimMatchResult, {}] = tournamentAPI.useClaimMatchResultMutation();

  const [result, setResult] = useState<"won" | "lost" | undefined>(undefined);

  const onImageSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLInputElement;

    if (!target.files || !props.teamId) {
      return;
    }

    const formData = new FormData();

    formData.append("image", target.files[0]);

    await dispatch(
      uploadMatchResultImage({ formData, matchId: props.match.id })
    );

    window.location.reload();
  };

  const selfResImage = props.selfParticipant?.res_image;

  const vsParticipant =
    props.match.participants[0].id === props.selfParticipant?.id
      ? props.match.participants[1]
      : props.match.participants[0];

  let timeBeforeAutoRes: any = new Date(props.match?.first_result_claimed);

  timeBeforeAutoRes.setMinutes(
    timeBeforeAutoRes.getMinutes() +
      Number(props.match?.time_to_confirm_results.split(":")[1])
  );

  timeBeforeAutoRes.setSeconds(
    timeBeforeAutoRes.getSeconds() +
      Number(props.match?.time_to_confirm_results.split(":")[2])
  );

  timeBeforeAutoRes = useCountdown(timeBeforeAutoRes);

  if (!props.teamId) {
    return <></>;
  }

  return (
    <>
      {props.match.state === "CONTESTED" ? (
        <h2 className="text-2xl text-warning text-center mt-8">
          Результат оспорен командой противника, администратор скоро прибудет
        </h2>
      ) : props.teamId === team &&
        props.match.state === "ACTIVE" &&
        props.isCaptain ? (
        <div className=" text-center mt-6 lg:mt-14">
          {!selfResImage && (
            <p
              data-content={`Перед отправкой результата прикрепите скрин из игры!`}
              className="before:lg:text-[20px] before:font-semibold before:top-0 before:bottom-0 before:left-0 before:right-0 
                             lg:text-[20px] font-semibold  before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent 
                before:absolute relative before:content-[attr(data-content)] z-50"
            >
              {`Перед отправкой результата прикрепите скрин из игры!`}
            </p>
          )}
          {((props.selfParticipant.is_winner === null &&
            vsParticipant.is_winner !== null) ||
            (props.selfParticipant.is_winner !== null &&
              vsParticipant.is_winner === null)) && (
            <p className="-mb-5">
              Результаты выставятся автоматически через{" "}
              {timeBeforeAutoRes.isInThePast
                ? "..."
                : `${timeBeforeAutoRes.minutes}:${
                    timeBeforeAutoRes.seconds > 9
                      ? timeBeforeAutoRes.seconds
                      : `0${timeBeforeAutoRes.seconds}`
                  }`}
            </p>
          )}
          <div className="flex items-center flex-col lg:flex-row gap-6 lg:gap-10 justify-evenly mt-10">
            {!selfResImage ? (
              <label
                className="hover:drop-shadow-[0_0_2px_#4cf2f8] transition duration-300"
                htmlFor="file_input"
              >
                <img
                  className="w-[200px]"
                  src={serverURL + "/media/img/uploadimg.svg"}
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
              required
            />
            {(props.selfParticipant.is_winner === undefined ||
              props.selfParticipant.is_winner === null) && (
              <div className="flex flex-col justify-center gap-[18px] lg:gap-10 items-start">
                <div>
                  <input
                    hidden
                    type="radio"
                    name="result"
                    value={1}
                    onChange={() => setResult("won")}
                    id="radiowon"
                  />
                  <label
                    className="flex w-full items-center"
                    htmlFor="radiowon"
                  >
                    {result === "won" ? <RadioTrue /> : <RadioFalse />}
                    <p
                      data-content={`Победа`}
                      className="before:lg:text-[20px] grow text-left ml-4 lg:ml-5 before:w-full before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                             lg:text-[20px] font-medium  before:bg-gradient-to-l 
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
                  <label
                    className="flex w-full items-center"
                    htmlFor="radiolost"
                  >
                    {result === "lost" ? <RadioTrue /> : <RadioFalse />}
                    <p
                      data-content={`Поражение`}
                      className="before:lg:text-[20px] grow text-left ml-4 lg:ml-5 before:w-full before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                             lg:text-[20px] font-medium  before:bg-gradient-to-l 
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
            className="py-4 px-8 focus:py-[14px] focus:px-[30px] active:py-[14px] active:px-[30px] mt-7 lg:mt-12 text-lg"
          >
            Отправить результат
          </ButtonMain>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MatchResultVote;

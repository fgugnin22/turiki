import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { uploadMatchResultImage } from "../shared/rtk/user";
const serverURL = import.meta.env.VITE_API_URL;

interface MatchResultVoteProps {
  starts: Date;
  isActive: Boolean;
  isCaptain: Boolean;
  matchId: number;
  teamId: number | undefined;
  isWinner?: boolean | null;
  claimMatchResult: Function;
  selfTeamResImage?: string;
  opponentTeamResImage?: string;
  isCompromised?: boolean;
  hasOpponentWon?: boolean;
}

const MatchResultVote = (props: MatchResultVoteProps) => {
  const { userDetails } = useAppSelector((state) => state.user);
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
      uploadMatchResultImage({ formData, matchId: props.matchId })
    );
    window.location.reload();
  };
  if (props.isCompromised) {
    return (
      <h2 className="text-2xl text-red-600 text-center mt-8">
        Результат оспорен командой противника, администратор скоро прибудет
      </h2>
    );
  }
  return (
    <>
      {Number(props.starts) < Number(new Date()) &&
        props.teamId === userDetails?.team &&
        props.isActive &&
        props.isCaptain && (
          <div className=" text-center">
            <h3 className="text-xl mt-8">
              Перед отправкой результата прикрепите скрин из игры!{" "}
            </h3>
            {(props.isWinner === null || props.isWinner === undefined) && (
              <div className="mt-4">
                <button
                  className={`py-2 px-3  ${
                    props.hasOpponentWon ? "bg-yellow-600" : "bg-green-600"
                  }
                  ${
                    props.hasOpponentWon
                      ? "hover:bg-yellow-700"
                      : "hover:bg-green-700"
                  } ${
                    props.hasOpponentWon
                      ? "focus:bg-yellow-500"
                      : "focus:ring-green-500"
                  }  ${
                    props.hasOpponentWon
                      ? " focus:ring-offset-yellow-200"
                      : " focus:ring-offset-green-200"
                  }
                   text-white w-48 mt-4 transition ease-in duration-200 text-center text-sm
                    font-semibold shadow-md focus:outline-none
                    focus:ring-2 focus:ring-offset-2  rounded-lg`}
                  onClick={() =>
                    props.claimMatchResult({
                      isWinner: true,
                      matchId: props.matchId,
                      teamId: props.teamId
                    })
                  }
                >
                  {props.hasOpponentWon
                    ? "Оспорить результат"
                    : "Моя команда выиграла"}
                </button>
                <button
                  className=" ml-8 py-2 px-3  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-48 mt-4 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  onClick={() =>
                    props.claimMatchResult({
                      isWinner: false,
                      matchId: props.matchId,
                      teamId: props.teamId
                    })
                  }
                >
                  Моя команда проиграла
                </button>
              </div>
            )}
            {!props.selfTeamResImage && (
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
            {props.selfTeamResImage && (
              <a
                className="py-2 px-3 mt-4 inline-block bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-48 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                href={`${serverURL}/${props.selfTeamResImage}`}
                target="_blank"
              >
                Свой результат
              </a>
            )}
            {props.opponentTeamResImage && (
              <a
                className=" ml-8 py-2 px-3 mt-4 inline-block bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-48 transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                href={`${serverURL}/${props.opponentTeamResImage}`}
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

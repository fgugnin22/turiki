import { useNavigate } from "react-router-dom";
import BracketConnecter from "./BracketConnecter";
import { ROUTES } from "./RouteTypes";
import { useAppSelector } from "./rtk/store";
import ButtonSecondary from "./ButtonSecondary";

type Participant = {
  name: string;
  status: "TBD" | "WON" | "LOST";
  teamId: number;
};
type Props = {
  timeString: string;
  matchId: number | string;
  participants: [Participant | null, Participant | null];
  hasChildMatches: boolean;
  size: {
    height: number;
    width: number;
  };
  round: number;
};

const EmptyParticipant = () => {
  return (
    <div className="py-3 pl-5 pr-6 text-lightgray relative text-lg font-medium">
      <span>-----------------</span>
      <p className=" text-right float-right">TBD</p>
    </div>
  );
};

const TeamParticipant = ({
  participant,
  isUserInParticipant
}: {
  participant: Participant | null;
  isUserInParticipant: boolean;
}) => {
  return participant ? (
    participant.status === "WON" ? (
      <div
        className="py-3 pl-5 pr-6 text-lightgray relative after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 
      after:rounded-[10px] after:bg-turquoise after:opacity-25 text-lg font-medium"
      >
        <span
          data-content={`${participant?.name} ${
            isUserInParticipant ? `(Вы)` : ""
          }`}
          className=" before:left-0 before:-top-[2px] before:bottom-0 before:right-0 font-bold text-left before:text-left before:font-bold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text  before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
        >
          {`${participant?.name} ${isUserInParticipant ? `(Вы)` : ""}`}
        </span>
        <p
          data-content={participant?.status}
          className=" before:top-0 before:bottom-0 before:left-0 before:right-0 text-right float-right  before:text-right before:font-bold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
        >
          {participant?.status}
        </p>
      </div>
    ) : (
      <div className="py-3 pl-5 pr-6 text-lightgray relative text-lg font-medium">
        <span>
          {`${participant?.name} ${isUserInParticipant ? `(Вы)` : ""}`}
        </span>
        <p className=" text-right float-right">{participant?.status}</p>
      </div>
    )
  ) : (
    <EmptyParticipant />
  );
};

const DynamicBracketMatch = ({
  timeString,
  matchId,
  participants,
  hasChildMatches,
  size,
  round
}: Props) => {
  const { userDetails } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const handleMatchClick = async () => {
    navigate(ROUTES.MATCHES.MATCH_BY_ID.buildPath({ id: Number(matchId) }), {
      replace: true
    });
  };
  const timeStarts = new Date(timeString);
  return (
    <div
      className="flex items-center ml-[150px] last-of-type:mr-[150px]"
      style={{
        height: `${size.height}px`
      }}
    >
      <div
        className="w-[350px] flex flex-row flex-wrap content-start rounded-[10px] relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px] 
            before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[700%]"
      >
        <div className="w-full bg-gradient-to-r from-lightblue to-turquoise text-center z-50 flex items-center justify-between rounded-t-[10px] pl-8 h-[52px]">
          <p className="text-lightgray text-base font-medium">
            {timeStarts.getTime() > 10 && (
              <>
                <span className="mr-6">
                  {timeStarts.getHours() > 9
                    ? timeStarts.getHours()
                    : `0${timeStarts.getHours()}`}
                  :
                  {timeStarts.getMinutes() > 9
                    ? timeStarts.getMinutes()
                    : `0${timeStarts.getMinutes()}`}
                </span>
                <span className="">
                  {timeStarts.getDate() > 9
                    ? timeStarts.getDate()
                    : `0${timeStarts.getDate()}`}
                  .
                  {timeStarts.getMonth() > 9
                    ? timeStarts.getMonth()
                    : `0${timeStarts.getMonth()}`}
                  .{timeStarts.getFullYear()}
                </span>
              </>
            )}
          </p>
          <ButtonSecondary
            className="h-full px-7 rounded-[5px] rounded-tr-[10px] after:rounded-[5px] after:rounded-tr-[10px] before:!rounded-[4px] before:!rounded-tr-[9px] "
            onClick={handleMatchClick}
          >
            <span
              data-content="Подробнее"
              className="z-40 before:w-full before:text-center before:bg-gradient-to-b 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
            >
              Подробнее
            </span>
          </ButtonSecondary>
        </div>
        <div className="p-6 z-50 w-full">
          <TeamParticipant
            isUserInParticipant={userDetails?.team === participants[0]?.teamId}
            participant={participants[0]}
          />

          <TeamParticipant
            isUserInParticipant={userDetails?.team === participants[1]?.teamId}
            participant={participants[1]}
          />
        </div>
        {hasChildMatches && <BracketConnecter round={round} />}
      </div>
    </div>
  );
};

export default DynamicBracketMatch;

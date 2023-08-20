import { useNavigate } from "react-router-dom";
import { tournamentAPI } from "./rtk/tournamentAPI";
import BracketConnecter from "./BracketConnecter";
import { ROUTES } from "../app/RouteTypes";
import { useAppSelector } from "./rtk/store";

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
const EmptyParticipant = ({ isAtTheTop }: { isAtTheTop: boolean }) => {
    return (
        <div
            className={`w-[350px] h-[50px] bg-white ${
                isAtTheTop ? "rounded-tl" : "rounded-b"
            }  text-[13px] font-light pl-[22px] pt-[16px]  pr-[24px]`}
        >
            ------------ <p className=" font-bold float-right">TBD</p>
        </div>
    );
};
const TeamParticipant = ({
    participant,
    isUserInParticipant,
    isAtTheTop
}: {
    participant: Participant | null;
    isUserInParticipant: boolean;
    isAtTheTop: boolean;
}) => {
    return participant ? (
        participant.status === "WON" ? (
            <div
                className={`w-[350px] h-[50px] bg-[#14a316] hover:bg-[#268474] transition-colors ${
                    isAtTheTop ? "rounded-tl" : "rounded-b"
                } text-[13px] font-light pl-[22px] pt-[16px] pr-[24px]`}
            >
                {participant?.name}{" "}
                <span className=" font-medium inline">
                    {isUserInParticipant && `(Ваша команда)`}
                </span>
                <p className=" font-bold float-right">{participant?.status}</p>
            </div>
        ) : (
            <div
                className={`w-[350px] h-[50px] bg-white ${
                    isAtTheTop ? "rounded-tl" : "rounded-b"
                } text-[13px] font-light pl-[22px] pt-[16px] pr-[24px]`}
            >
                {participant?.name}{" "}
                <span className=" font-medium inline">
                    {isUserInParticipant && `(Ваша команда)`}
                </span>
                <p className=" font-bold float-right">{participant?.status}</p>
            </div>
        )
    ) : (
        <EmptyParticipant isAtTheTop={isAtTheTop} />
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
        navigate(
            ROUTES.MATCHES.MATCH_BY_ID.buildPath({ id: Number(matchId) }),
            { replace: true }
        );
    };
    const timeStarts = new Date(timeString);
    return (
        <div
            className="flex items-center ml-[150px] last-of-type:mr-[150px]"
            style={{
                height: `${size.height}px`
            }}
        >
            <div className="w-[350px] h-[120px] flex flex-row flex-wrap content-start text-[13px] ">
                <div className="w-[60px] h-[16px] ml-2 my-auto text-[#818181] text-[10px]">
                    <p className=" float-left">
                        {timeStarts.getHours()}:{timeStarts.getMinutes()}
                    </p>
                    <p className=" float-right">
                        {timeStarts.getDate()}.
                        {timeStarts.getMonth() < 10
                            ? "0" + String(timeStarts.getMonth())
                            : timeStarts.getMonth()}
                    </p>
                </div>{" "}
                {
                    <button
                        className="block w-[90px] h-[25px] ml-auto bg-[#717171] rounded-t-[3px] text-center leading-[27px] text-white text-[11px] font-extralight"
                        onClick={handleMatchClick}
                    >
                        Подробнее
                    </button>
                }
                {
                    <TeamParticipant
                        isAtTheTop={true}
                        isUserInParticipant={
                            userDetails?.team === participants[0]?.teamId
                        }
                        participant={participants[0]}
                    />
                }
                {
                    <TeamParticipant
                        isAtTheTop={false}
                        isUserInParticipant={
                            userDetails?.team === participants[1]?.teamId
                        }
                        participant={participants[1]}
                    />
                }
                {hasChildMatches && <BracketConnecter round={round} />}
            </div>
        </div>
    );
};

export default DynamicBracketMatch;

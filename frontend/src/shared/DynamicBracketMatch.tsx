import { useNavigate } from "react-router-dom";
import { tournamentAPI } from "../rtk/tournamentAPI";
import BracketConnecter from "./BracketConnecter";
import { ROUTES } from "../app/RouteTypes";

type participants = {
    name: string;
    status: "TBD" | "WON" | "LOST";
};

type Props = {
    timeStarts?: string | Date;
    matchId: number | string;
    participants: [participants | null, participants | null];
    isNext: boolean;
    size: {
        height: number;
        width: number;
    };
    round: number;
};

const DynamicBracketMatch = ({
    timeStarts,
    matchId,
    participants,
    isNext,
    size,
    round
}: Props) => {
    console.log(size);
    const navigate = useNavigate();
    const handleMatchClick = async () => {
        navigate(
            ROUTES.MATCHES.MATCH_BY_ID.buildPath({ id: Number(matchId) }),
            { replace: true }
        );
    };

    return (
        <div
            className="flex items-center ml-[150px] last-of-type:mr-[150px]"
            style={{
                height: `${size.height}px`
            }}
        >
            <div className="w-[350px] h-[120px] flex flex-row flex-wrap content-start text-[13px] ">
                <div className="w-[60px] h-[16px] ml-2 my-auto text-[#818181] text-[10px]">
                    <p className=" float-left">18:52</p>
                    <p className=" float-right">09.08</p>
                </div>{" "}
                <button
                    className="block w-[90px] h-[25px] ml-auto bg-[#717171] rounded-t-[3px] text-center leading-[27px] text-white text-[11px] font-thin"
                    onClick={handleMatchClick}
                >
                    Подробнее
                </button>
                {participants[0] ? (
                    participants[0].status === "WON" ? (
                        <div className="w-[350px] h-[50px] bg-[#14A38B] hover:bg-[#268474] transition-colors rounded-tl text-[13px] font-thin pl-[22px] pt-[16px] pr-[24px]">
                            {participants[0]?.name}
                            <p className=" font-bold float-right">
                                {participants[0]?.status}
                            </p>
                        </div>
                    ) : (
                        <div className="w-[350px] h-[50px] bg-white rounded-tl text-[13px] font-thin pl-[22px] pt-[16px] pr-[24px]">
                            {participants[0]?.name}
                            <p className=" font-bold float-right">
                                {participants[0]?.status}
                            </p>
                        </div>
                    )
                ) : (
                    <div className="w-[350px] h-[50px] bg-white rounded-tl  text-[13px] font-thin pl-[22px] pt-[16px]  pr-[24px]">
                        ------------{" "}
                        <p className=" font-bold float-right">TBD</p>
                    </div>
                )}
                {participants[1] ? (
                    participants[1].status === "WON" ? (
                        <div className="w-[350px] h-[50px] bg-[#14A38B] hover:bg-[#268474] transition-colors rounded-b text-[13px] font-thin pl-[22px] pt-[16px] pr-[24px]">
                            {participants[0]?.name}
                            <p className=" font-bold float-right">
                                {participants[1]?.status}
                            </p>
                        </div>
                    ) : (
                        <div className="w-[350px] h-[50px] bg-white rounded-b text-[13px] font-thin pl-[22px] pt-[16px] pr-[24px]">
                            {participants[0]?.name}
                            <p className=" font-bold float-right">
                                {participants[1]?.status}
                            </p>
                        </div>
                    )
                ) : (
                    <div className="w-[350px] h-[50px] bg-white rounded-bl rounded-br  text-[13px] font-thin pl-[22px] pt-[16px]  pr-[24px]">
                        ------------{" "}
                        <p className=" font-bold float-right">TBD</p>
                    </div>
                )}
                {isNext && <BracketConnecter round={round} />}
            </div>
        </div>
    );
};

export default DynamicBracketMatch;

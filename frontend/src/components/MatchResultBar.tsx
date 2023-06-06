import React from "react";
interface MatchResultBarProps {
    match: any;
    selfParticipant: any;
}
const MatchResultBar = (props: MatchResultBarProps) => {
    console.log(props);
    return (
        <div className="mt-0">
            {props.match?.state === "SCORE_DONE" &&
                props.selfParticipant !== null &&
                (props.selfParticipant?.is_winner ? (
                    <p className="p-3 text-center w-full bg-lime-500">
                        You won this match
                    </p>
                ) : (
                    <p className="p-3 text-center bg-red-500">
                        You lost this match
                    </p>
                ))}
        </div>
    );
};

export default MatchResultBar;

import React from "react";
interface MatchResultBarProps {
  match: any;
  selfParticipant: any;
}
const MatchResultBar = (props: MatchResultBarProps) => {
  return (
    <div className="mt-0">
      {props.match?.state === "SCORE_DONE" &&
        props.selfParticipant !== null &&
        (props.selfParticipant?.is_winner ? (
          <p className="p-3 text-center w-full bg-green-600">
            Вы выиграли этот матч!
          </p>
        ) : (
          <p className="p-3 text-center bg-red-500">Вы проиграли этот матч!</p>
        ))}
    </div>
  );
};

export default MatchResultBar;

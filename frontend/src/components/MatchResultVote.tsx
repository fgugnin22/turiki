interface MatchResultVoteProps {
    starts: Date;
    isActive: Boolean;
    isCaptain: Boolean;
    matchId: Number,
    participantId: Number,
    isWinner: Boolean | null;
    claimMatchResult: (args: Omit<MatchResultVoteProps, "starts" | "isCaptain"|  "isActive" | "claimMatchResult">) => void;
}

const MatchResultVote = (props: MatchResultVoteProps) => {
    return (
        <div>
            {Number(props.starts) < Number(new Date()) &&
                props.isActive &&
                props.isWinner !== null &&
                props.isCaptain &&
                (props.isWinner ? (
                    <div>
                        <button
                            className="p-2 rounded bg-green-400 m-2"
                            onClick={() =>
                                props.claimMatchResult({
                                    isWinner: props.isWinner,
                                    matchId: props.matchId,
                                    participantId: props.participantId
                                })
                            }
                        >
                            Мы падибили!!
                        </button>
                        <button
                            className="p-2 rounded bg-red-500 m-2"
                            onClick={() =>
                                props.claimMatchResult({
                                    isWinner: props.isWinner,
                                    matchId: props.matchId,
                                    participantId: props.participantId
                                })
                            }
                        >
                            Мы прасрали!!
                        </button>
                        {/* { participantId, isWinner, matchId } */}
                    </div>
                ) : (
                    <p>Ожидаем ответа от капитана другой команды...</p>
                ))}
        </div>
    );
};

export default MatchResultVote;

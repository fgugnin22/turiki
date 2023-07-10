import { tournamentAPI } from "../rtk/tournamentAPI";

interface MatchResultVoteProps {
    starts: Date;
    isActive: Boolean;
    isCaptain: Boolean;
    matchId: number;
    participantId: number;
    isWinner: Boolean | null;
    claimMatchResult: Function;
}

const MatchResultVote = (props: MatchResultVoteProps) => {
    if (!props.participantId) {
        return <></>;
    }
    return (
        <div>
            {Number(props.starts) < Number(new Date()) &&
                props.isActive &&
                props.isCaptain &&
                (props.isWinner === null || props.isWinner === undefined ? (
                    <div className="bg-slate-400 text-center">
                        <button
                            className="p-2 rounded bg-green-400 m-2"
                            onClick={() =>
                                props.claimMatchResult({
                                    isWinner: true,
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
                                    isWinner: false,
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

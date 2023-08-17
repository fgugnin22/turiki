import { tournamentAPI } from "../rtk/tournamentAPI";

interface MatchResultVoteProps {
    starts: Date;
    isActive: Boolean;
    isCaptain: Boolean;
    matchId: number;
    teamId: number | undefined;
    isWinner: Boolean | null;
    claimMatchResult: Function;
}

const MatchResultVote = (props: MatchResultVoteProps) => {
    if (!props.teamId) {
        return <></>;
    }
    console.log(props)
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
                                    teamId: props.teamId
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
                                    teamId: props.teamId
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

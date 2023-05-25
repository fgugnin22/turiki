import React from "react";
import { Link } from "react-router-dom";
// match.participants[1].team.id

// match.participants[1].team.name
interface TeamPlayerListProps {
    team: any;
}
const TeamPlayerList = (props: TeamPlayerListProps) => {
    return (
        <div className="p-2 rounded-lg bg-slate-100">
            <Link
                to={`/team/${props.team.id}`}
                className="p-3 rounded-md bg-slate-300 m-2 text-xl hover:bg-slate-400 block transition-colors"
            >
                <div>{props.team.name}</div>
            </Link>
            {props.team &&
                props.team.players.map((player) => (
                    <Link
                        key={player.id}
                        to={`/player/${player.id}`}
                        className="p-2 bg-zinc-400 block rounded-sm hover:bg-slate-400 "
                    >
                        <div>{player.name}</div>
                    </Link>
                ))}
        </div>
    );
};

export default TeamPlayerList;

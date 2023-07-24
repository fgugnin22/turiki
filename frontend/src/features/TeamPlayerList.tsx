import React, { Key } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../shared";
import { ROUTES } from "../app/RouteTypes";

export type Player = Omit<IUser, "email" | "is_active" | "team">;
interface TeamPlayerListProps {
    team: {
        id:number;
        games:string[];
        players: Player[];
        name:string;
        next_member?:string;
        tournaments: any[];
    };
}

const TeamPlayerList = (props: TeamPlayerListProps) => {
    return (
        <div className="p-2 rounded-lg bg-slate-100">
            <Link
                // to={`/team/${props.team.id}`}
                to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({id: props.team.id})}
                className="p-3 rounded-md bg-slate-300 m-2 text-xl hover:bg-slate-400 block transition-colors"
            >
                <div>{props.team.name}</div>
            </Link>
            {props.team &&
                props.team.players.map((player) => (
                    <Link
                        key={player.id as Key}
                        to="#"
                        // to={`/player/${player.id}`}
                        className="p-2 bg-zinc-400 block rounded-sm hover:bg-slate-400 "
                    >
                        <div>{player.name}</div>
                    </Link>
                ))}
        </div>
    );
};

export default TeamPlayerList;

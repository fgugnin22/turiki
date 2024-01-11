import React, { Key } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../shared";
import { ROUTES } from "../shared/RouteTypes";
const serverURL = import.meta.env.VITE_API_URL;

export type Player = Omit<IUser, "email" | "is_active" | "team">;
interface TeamPlayerListProps {
    team: {
        id: number;
        games: string[];
        players: Player[];
        name: string;
        next_member?: string;
        tournaments: any[];
        image: string;
    };
}

const TeamPlayerList = (props: TeamPlayerListProps) => {
    return (
        <div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
            <p className="font-bold text-black text-md dark:text-white">
                {props.team.name}
            </p>
            <ul>
                {props.team.players.map((player, i) => {
                    return (
                        <li
                            key={i}
                            className="flex items-center my-6 space-x-2"
                        >
                            <a href="#" className="relative block">
                                <img
                                    alt="profil"
                                    src={`${serverURL}/${props.team.image}`}
                                    className="mx-auto object-cover rounded-full h-10 w-10 "
                                />
                            </a>
                            <div className="flex flex-col">
                                <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    {player.name}
                                </span>
                                <span className="ml-2 text-sm text-gray-400 dark:text-gray-300">
                                    {player.game_name}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

        // <div classNameName="p-2 rounded-lg bg-slate-100">
        //     <Link
        //         // to={`/team/${props.team.id}`}
        //         to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({id: props.team.id})}
        //         classNameName="p-3 rounded-md bg-slate-300 m-2 text-xl hover:bg-slate-400 block transition-colors"
        //     >
        //         <div>{props.team.name}</div>
        //     </Link>
        //     {props.team &&
        //         props.team.players.map((player) => (
        //             <Link
        //                 key={player.id as Key}
        //                 to="#"
        //                 // to={`/player/${player.id}`}
        //                 classNameName="p-2 bg-zinc-400 block rounded-sm hover:bg-slate-400 "
        //             >
        //                 <div>{player.name}</div>
        //             </Link>
        //         ))}
        // </div>
    );
};

export default TeamPlayerList;

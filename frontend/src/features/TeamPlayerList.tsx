import { IUser } from "../shared";
import { Angle } from "../shared/Angle";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Match } from "../helpers/transformMatches";
const serverURL = import.meta.env.VITE_API_URL;

export type Player = Omit<IUser, "email" | "is_active" | "team">;
type TeamPlayerListProps = {
    team: {
        id: number;
        games: string[];
        players: Player[];
        name: string;
        next_member?: string;
        tournaments: any[];
        image: string;
    };
    match: Match;
};

const TeamPlayerList = (props: TeamPlayerListProps) => {
    const { data: tournament, isSuccess } =
        tournamentAPI.useGetTournamentByIdQuery({
            id: props.match.tournament ?? -1
        });
    return (
        <div
            className="rounded-[10px] relative after:absolute 
            before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0
            before:z-10 z-20 before:bg-dark before:rounded-[9px]
            before:bg-gradient-to-br before:from-transparent before:to-darkturquoise before:from-[-40%] before:to-[800%]"
        >
            <Angle />
            <div className="w-full h-full relative z-50">
                <div className="flex items-center mt-7 mx-14 justify-between">
                    <p
                        data-content={props.team.name}
                        className="before:text-[20px] before:font-medium before:inset-0 
                           text-left text-[20px] font-medium  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                    >
                        {props.team.name}{" "}
                    </p>
                    <a href="#" className="">
                        <img
                            alt="profil"
                            src={`${serverURL}/${props.team.image}`}
                            className="object-cover rounded-full h-10 w-10 "
                        />
                    </a>
                </div>
                <div className="bg-gradient-to-r from-lightblue to-turquoise h-[1px] neonshadow mx-9 mt-5"></div>
                <ul className="flex flex-wrap gap-y-7 my-7 mx-12">
                    {props.team.players
                        .filter((plr) => {
                            return tournament?.players.find(
                                (p) => p.id === plr.id
                            );
                        })
                        .map((player, i) => {
                            return (
                                <li
                                    key={i}
                                    className="flex items-center space-x-4"
                                >
                                    <img
                                        src={`${serverURL}/${
                                            player.image ??
                                            "assets/img/userdefaultloggedin.svg"
                                        }`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex flex-wrap  text-lightblue font-medium">
                                        <p className="block">{player.name}</p>
                                        {player.team_status === "CAPTAIN" && (
                                            <img
                                                src={`${serverURL}/assets/img/crown.svg`}
                                                className="ml-1 block"
                                            />
                                        )}
                                        <p className=" block w-full">
                                            <span className="text-lightgray">
                                                r6:{" "}
                                            </span>
                                            {player.game_name}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </div>
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

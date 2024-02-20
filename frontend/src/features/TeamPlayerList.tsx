import { IUser } from "../shared";
import { Angle } from "../shared/Angle";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Match } from "../helpers/transformMatches";
import { getImagePath } from "../helpers/getImagePath";
import { ROUTES } from "../shared/RouteTypes";
import { Link } from "react-router-dom";
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
  tournamentId: string | number;
};

const TeamPlayerList = (props: TeamPlayerListProps) => {
  const { data: tournament, isSuccess } =
    tournamentAPI.useGetTournamentByIdQuery({
      id: props.tournamentId
    });

  return (
    <div
      className="rounded-[10px] relative after:absolute 
            before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0
            before:z-10 z-20 before:bg-dark before:rounded-[9px]
            before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%]"
    >
      <Angle color="#21DBD3" />
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
          <Link to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: props.team.id })}>
            <img
              alt="profil"
              src={`${serverURL}/${getImagePath(props.team.image)}`}
              className="object-cover rounded-full h-10 w-10 "
            />
          </Link>
        </div>
        <div className="bg-gradient-to-r from-lightblue to-turquoise h-[1px] neonshadow mx-9 mt-5"></div>
        <ul className="flex flex-wrap gap-y-7 my-7 mx-12">
          {props.team.players
            .filter((plr) => {
              return tournament?.players.find((p) => p.id === plr.id);
            })
            .map((player, i) => {
              return (
                <li key={i} className="flex items-center space-x-4">
                  <img
                    src={
                      Number(player?.image?.length) > 0
                        ? serverURL + "/" + getImagePath(player.image!)
                        : serverURL + "/media/img/userdefaultloggedin.svg"
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-wrap  text-lightblue font-medium">
                    <p className="block">{player.name}</p>
                    {player.team_status === "CAPTAIN" && (
                      <img
                        src={`${serverURL}/media/img/crown.svg`}
                        className="ml-1 block"
                      />
                    )}
                    <p className=" block w-full">
                      <span className="text-lightgray">r6: </span>
                      {player.game_name}
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default TeamPlayerList;

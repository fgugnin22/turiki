import { IUser } from "../shared";
import { Angle } from "../shared/Angle";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Match } from "../helpers/transformMatches";
import { getImagePath } from "../helpers/getImagePath";
import { ROUTES } from "../shared/RouteTypes";
import { Link } from "react-router-dom";
const serverURL = import.meta.env.VITE_API_URL;

export type Player = Omit<IUser, "is_active" | "team">;
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
  isWinner: boolean;
};

const TeamPlayerList = (props: TeamPlayerListProps) => {
  const { data: tournament, isSuccess } =
    tournamentAPI.useGetTournamentByIdQuery({
      id: props.tournamentId
    });

  return (
    <div
      className="order-1 rounded-[10px] relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0
            before:z-10 z-20 before:bg-dark before:rounded-[9px]
            before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%]"
    >
      <Angle color="#21DBD3" />
      <div className="w-full h-full relative z-50">
        <div className="flex items-center mt-2 lg:mt-7 lg:mx-14 justify-between">
          <Link
            className="flex justify-between w-full"
            to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: props.team.id })}
          >
            <p
              data-content={props.team.name}
              className="before:lg:text-[20px] text-sm before:text-sm mx-auto lg:m-0 before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                           lg:text-left lg:text-[20px] font-medium  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)] flex gap-4"
            >
              {props.team.name}{" "}
              {props.isWinner && (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={"stroke-lightblue relative"}
                >
                  <path
                    d="M12.0002 16C6.24021 16 5.21983 10.2595 5.03907 5.70647C4.98879 4.43998 4.96365 3.80673 5.43937 3.22083C5.91508 2.63494 6.48445 2.53887 7.62318 2.34674C8.74724 2.15709 10.2166 2 12.0002 2C13.7837 2 15.2531 2.15709 16.3771 2.34674C17.5159 2.53887 18.0852 2.63494 18.5609 3.22083C19.0367 3.80673 19.0115 4.43998 18.9612 5.70647C18.7805 10.2595 17.7601 16 12.0002 16Z"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M19 5L19.9486 5.31621C20.9387 5.64623 21.4337 5.81124 21.7168 6.20408C22 6.59692 22 7.11873 21.9999 8.16234L21.9999 8.23487C21.9999 9.09561 21.9999 9.52598 21.7927 9.87809C21.5855 10.2302 21.2093 10.4392 20.4569 10.8572L17.5 12.5"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4.99994 5L4.05132 5.31621C3.06126 5.64623 2.56623 5.81124 2.2831 6.20408C1.99996 6.59692 1.99997 7.11873 2 8.16234L2 8.23487C2.00003 9.09561 2.00004 9.52598 2.20723 9.87809C2.41441 10.2302 2.79063 10.4392 3.54305 10.8572L6.49994 12.5"
                    strokeWidth="1.5"
                  />
                  <path d="M12 17V19" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M15.5 22H8.5L8.83922 20.3039C8.93271 19.8365 9.34312 19.5 9.8198 19.5H14.1802C14.6569 19.5 15.0673 19.8365 15.1608 20.3039L15.5 22Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M18 22H6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </p>
            {props.team.image && (
              <img
                alt="profil"
                src={`${serverURL}/${getImagePath(props.team.image)}`}
                className="hidden lg:block object-cover rounded-full h-10 w-10 "
              />
            )}
          </Link>
        </div>
        <div className="bg-gradient-to-r from-lightblue to-turquoise h-[1px] neonshadow mx-2 mt-[6px] lg:mx-9 lg:mt-5"></div>
        <ul className="flex flex-wrap gap-2 m-2 lg:gap-y-7 lg:my-7 lg:mx-12">
          {props.team.players
            .filter((plr) => {
              return tournament?.players.find((p) => p.id === plr.id);
            })
            .map((player) => {
              return (
                <li
                  key={player.id + "palyer213123"}
                  className="flex items-center gap-[7px] lg:gap-4 text-xs"
                >
                  <img
                    src={
                      Number(player?.image?.length) > 0
                        ? serverURL + "/" + getImagePath(player.image!)
                        : serverURL + "/media/img/defaultuser.svg"
                    }
                    className="w-[15px] lg:w-10 h-[15px] lg:h-10 rounded-full"
                  />
                  <div className="flex flex-wrap  text-lightblue font-medium">
                    <p className="block">
                      {player.name ||
                        player.game_name ||
                        player.email.split("@")[0] ||
                        player.game_name ||
                        player.email.split("@")[0]}
                    </p>
                    {player.team_status === "CAPTAIN" && (
                      <img
                        src={`${serverURL}/media/img/crown.svg`}
                        className="ml-1 block w-[13px] lg:w-[initial]"
                      />
                    )}
                    <p className="hidden lg:block w-full">
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

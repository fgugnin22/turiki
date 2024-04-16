import { IUser } from "../shared";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { getImagePath } from "../helpers/getImagePath";
import { Match, Participant } from "../helpers/transformMatches";
import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
const serverURL = import.meta.env.VITE_API_URL;
export type Player = Omit<IUser, "email" | "is_active" | "team">;
type TournamentTeamPlayerListProps = {
  team: {
    id: number;
    name: string;
    image: string;
  };
  tournamentId: string | number;
};

const TournamentTeamPlayerList = (props: TournamentTeamPlayerListProps) => {
  const { data: tournament } = tournamentAPI.useGetTournamentByIdQuery({
    id: props.tournamentId
  });

  const { data: team } = tournamentAPI.useGetTeamByIdQuery(props.team.id);

  const bestMatch = JSON.parse(JSON.stringify(tournament?.matches))
    .sort((a: Match, b: Match) => b.id - a.id)
    .find(
      (m: Match) =>
        m.participants.findIndex((p: Participant) => p.team.id === team?.id) !==
        -1
    );

  const placement =
    Number(bestMatch?.name) +
    (bestMatch?.participants.find((p: Participant) => p.team.id === team?.id)
      ?.result_text === "LOST"
      ? 1
      : 0);
  const placementStr =
    placement < 3
      ? `${placement}`
      : `${placement}-${2 ** Number(bestMatch?.name)}`;

  return (
    <div
      className="rounded-[10px] relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0
            before:z-10 z-20 before:bg-dark before:rounded-[9px]
            before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%] before:drop-shadow-[0_0_3px_#4cf2f8]"
    >
      {team && (
        <div className="w-full relative z-50 ">
          <div className="flex items-center mt-5 mx-6 gap-3 justify-start">
            <Link
              to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: props.team.id })}
              className="flex items-center gap-2"
            >
              {props.team.image && (
                <img
                  alt="profil"
                  src={`${serverURL}/${getImagePath(props.team.image)}`}
                  className="object-cover rounded-full h-10 w-10 "
                />
              )}

              <p
                data-content={team.name}
                className="ml-2 before:text-[16px] before:font-semibold before:top-0 before:bottom-0 before:left-0 before:right-0 
                           text-left text-[16px] font-semibold  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
              >
                {team.name}{" "}
              </p>
            </Link>
            {tournament?.status === "PLAYED" ? (
              <p
                data-content={"Место: " + placementStr}
                className="ml-auto before:text-[16px] before:font-semibold before:top-0 before:bottom-0 before:left-0 before:right-0 
                           text-left text-[16px] font-semibold  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
              >
                {"Место: " + placementStr}
              </p>
            ) : (
              <p
                data-content={`Взнос: 
              ${
                team.payment[tournament?.name ?? ""]?.is_confirmed
                  ? "Есть"
                  : "Нет"
              }`}
                className="ml-auto before:text-[16px] before:font-semibold before:top-0 before:bottom-0 before:left-0 before:right-0 
                           text-left text-[16px] font-semibold  before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
              >
                {`Взнос: 
              ${
                team.payment[tournament?.name ?? ""]?.is_confirmed
                  ? "Есть"
                  : "Нет"
              }`}
              </p>
            )}
          </div>
          <div className="bg-gradient-to-r from-lightblue to-turquoise h-[1px] neonshadow mx-6 mt-3"></div>
          <ul className="flex flex-col gap-y-4  mx-6 relative my-4">
            {team.players
              .filter((plr) => {
                return tournament?.players.find((p) => p.id === plr.id);
              })
              .map((player, i) => {
                return (
                  <li key={i} className="flex items-center space-x-3 text-xs">
                    <img
                      src={`${serverURL}/${
                        player.image
                          ? getImagePath(player.image)
                          : "media/img/defaultuser.svg"
                      }`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-wrap text-lightblue font-medium">
                      <p className="block">
                        {player.name ||
                          player.game_name ||
                          player.email.split("@")[0]}
                      </p>
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
            {/* {team.players
              .filter((plr) => {
                return tournament?.players.find((p) => p.id === plr.id);
              })
              .map((player, i) => {
                return (
                  <li key={i} className="flex items-center space-x-2 text-xs">
                    <img
                      src={`${serverURL}/${
                        player.image
                          ? getImagePath(player.image)
                          : "media/img/defaultuser.svg"
                      }`}
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-wrap text-lightblue font-medium">
                      <p className="block">{player.name ||
                                player.game_name ||
                                player.email.split("@")[0]}</p>
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
              })} */}
            {/* {team.players
              .filter((plr) => {
                return tournament?.players.find((p) => p.id === plr.id);
              })
              .map((player, i) => {
                return (
                  <li key={i} className="flex items-center space-x-2 text-xs">
                    <img
                      src={`${serverURL}/${
                        player.image
                          ? getImagePath(player.image)
                          : "media/img/defaultuser.svg"
                      }`}
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-wrap text-lightblue font-medium">
                      <p className="block">{player.name ||
                                player.game_name ||
                                player.email.split("@")[0]}</p>
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
            {team.players
              .filter((plr) => {
                return tournament?.players.find((p) => p.id === plr.id);
              })
              .map((player, i) => {
                return (
                  <li key={i} className="flex items-center space-x-2 text-xs">
                    <img
                      src={`${serverURL}/${
                        player.image
                          ? getImagePath(player.image)
                          : "media/img/defaultuser.svg"
                      }`}
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-wrap text-lightblue font-medium">
                      <p className="block">{player.name ||
                                player.game_name ||
                                player.email.split("@")[0]}</p>
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
            {team.players
              .filter((plr) => {
                return tournament?.players.find((p) => p.id === plr.id);
              })
              .map((player, i) => {
                return (
                  <li key={i} className="flex items-center space-x-2 text-xs">
                    <img
                      src={`${serverURL}/${
                        player.image
                          ? getImagePath(player.image)
                          : "media/img/defaultuser.svg"
                      }`}
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-wrap text-lightblue font-medium">
                      <p className="block">{player.name ||
                                player.game_name ||
                                player.email.split("@")[0]}</p>
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
              })} */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TournamentTeamPlayerList;

import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import { useAppSelector } from "../shared/rtk/store";
import { useState } from "react";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { Team, Tournament } from "../helpers/transformMatches";
import React from "react";
import { useTournamentStatus } from "../hooks/useTournamentStatus";
const serverURL = import.meta.env.VITE_API_URL;

const TournamentList = () => {
  const [createBracket] = tournamentAPI.useCreateBracketMutation();
  const [initializeMatches] = tournamentAPI.useInitializeMatchesMutation();
  const [fetchTeamById] = tournamentAPI.useLazyGetTeamByIdQuery();
  const { data, error, isLoading, isSuccess } =
    tournamentAPI.useGetAllTournamentsQuery(null);
  const [teamIds, setTeamIds] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTeamIds((prev) => {
      prev[Number(target.id)] = target.value === "" ? "" : Number(target.value);
      return [...prev];
    });
  };
  const handleTeamSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    const data = (await fetchTeamById(teamIds[Number(target.id)])).data!;
    setTeams((prev) => {
      prev[Number(target.id)] = data;
      return [...prev];
    });
  };
  const handleManagingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowAdminModal((prev) => !prev);
  };
  const { userDetails } = useAppSelector((state) => state.user);
  return (
    <Layout>
      {
        <section>
          <h2
            data-content="Турниры"
            className="before:text-[44px] before:inset-0  w-full text-center text-[44px] before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
          >
            Турниры
          </h2>
          {isSuccess && data?.length > 0 ? (
            <div className="mx-auto mt-12 text-lightgray">
              {data?.map((tourn, index) => {
                const statusString = useTournamentStatus(tourn.status);
                return (
                  <div className="flex gap-x-2 text-black" key={index}>
                    <Link
                      to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                        id: data[index]["id"]
                      })}
                      className={`shadow mx-auto w-full relative mb-4 hover:bg-turquoise hover:bg-opacity-30 transition h-24 bg-transparent
                                         flex text-center justify-between  items-center rounded-[10px] after:absolute 
                                         before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
                                       after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                                         before:z-10 z-20 before:bg-dark before:rounded-[9px] hover:before:bg-opacity-80 hover:before:transition active:before:bg-opacity-50`}
                    >
                      <div className=" w-1/5 h-full flex items-center border-r border-lightblue z-30">
                        <p
                          data-content={tourn.name}
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow"
                        >
                          {tourn.name}
                        </p>
                      </div>
                      <p className="z-30">
                        <span
                          data-content="Призовой фонд:"
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 w-full block leading-6"
                        >
                          Призовой фонд:
                        </span>

                        <span
                          data-content={tourn.prize}
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 leading-6"
                        >
                          {tourn.prize}
                        </span>
                      </p>
                      <p
                        data-content={`${tourn.teams.length}/${
                          2 ** tourn.max_rounds
                        } Команд`}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30"
                      >
                        Команд: {tourn.teams.length}/{2 ** tourn.max_rounds}
                      </p>
                      <p
                        data-content={statusString}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[180px]"
                      >
                        {statusString}
                      </p>
                      <p
                        data-content={`Раундов: ${tourn.max_rounds}`}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[18%]"
                      >
                        Раундов: {tourn.max_rounds}
                      </p>
                      <img
                        src={`${serverURL}/assets/img/forward.svg`}
                        className="z-30 mr-8 neonshadow"
                        alt=""
                      />
                    </Link>
                    {userDetails?.is_staff && (
                      <>
                        <button
                          onClick={handleManagingClick}
                          className="md:block rounded h-24 border p-3 hover:bg-slate-100 transition active:bg-purple-700 hidden"
                        >
                          Управление
                        </button>
                        {userDetails?.is_staff && showAdminModal && (
                          <div className="md:grid grid-cols-2 gap-1 mb-4 w-44 lg:max-w-full hidden">
                            <button
                              onClick={() => createBracket(tourn.id)}
                              className=" hover:underline text-xs hover:text-blue-600 border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                            >
                              Create Bracket
                            </button>
                            <button
                              onClick={() => initializeMatches(tourn.id)}
                              className=" hover:underline text-xs hover:text-blue-600 border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                            >
                              Initialize Matches
                            </button>
                            <button
                              id={String(index)}
                              onClick={handleTeamSubmit}
                              className=" hover:underline text-xs hover:text-blue-600 border border-gray-600 rounded-lg p-1 hover:bg-slate-100"
                            >
                              Найти команду
                            </button>
                            <input
                              id={String(index)}
                              value={teamIds[index]}
                              onChange={handleChange}
                              className="h-10 w-[100%] text-xs ml-auto border border-gray-600 rounded-lg p-1"
                              type="number"
                              placeholder="Id команды"
                            />
                            {teams[index] && (
                              <div
                                className="self-end mt-auto col-span-2"
                                key={teams[index].id}
                              >
                                <RegisterTeamModal
                                  maxPlayers={tourn.max_players_in_team}
                                  tournamentId={tourn.id}
                                  team={teams[index]}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      }
    </Layout>
  );
};

export default TournamentList;

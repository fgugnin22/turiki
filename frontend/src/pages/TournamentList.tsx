import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { useAppSelector } from "../shared/rtk/store";
import { useState } from "react";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { Team, Tournament } from "../helpers/transformMatches";
import React from "react";
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
          <h1 className="text-5xl text-center mt-8">Турниры</h1>
          {isSuccess && data?.length > 0 ? (
            <div className="mx-auto mt-12">
              {!userDetails?.is_staff && (
                <div className={`grid mx-auto w-[70%] grid-cols-5 mb-4`}>
                  <h2 className="text-md font-light text-center">Название</h2>
                  <h2 className="text-md font-light text-center">
                    Призовой фонд
                  </h2>
                  <h2 className="text-md font-light text-center">
                    Количество команд
                  </h2>
                  <h2 className="text-md font-light text-center">Статус</h2>
                  <h2 className="text-md font-light text-center">
                    Количество раундов
                  </h2>
                </div>
              )}
              {data?.map((tourn, index) => (
                <div className="flex gap-x-2" key={index}>
                  <Link
                    to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                      id: data[index]["id"]
                    })}
                    className={`shadow mx-auto ${
                      userDetails?.is_staff ? "w-full" : "w-[70%]"
                    } relative border mb-4 hover:bg-slate-200 transition h-24 bg-white dark:bg-gray-800 rounded-md grid grid-cols-5 text-center items-center`}
                  >
                    <h2 className="text-lg">{tourn.name}</h2>
                    <h3 className="text-lg text-orange-600 font-light inline">
                      {tourn.prize}
                    </h3>
                    <h3 className=" font-light text-md">
                      Команд: {tourn.teams.length}/{2 ** tourn.max_rounds}
                    </h3>
                    <h3 className=" font-light text-md">{tourn.status}</h3>
                    <h3 className=" font-light text-md">
                      Раундов: {tourn.max_rounds}
                    </h3>
                  </Link>

                  {userDetails?.is_staff && (
                    <>
                      <button
                        onClick={handleManagingClick}
                        className="block rounded h-24 border p-3 hover:bg-slate-100 transition active:bg-purple-700"
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
              ))}
            </div>
          ) : (
            <p className="text-xl p-2 bg-slate-300">Турниров нет!</p>
          )}
        </section>
      }
    </Layout>
  );
};

export default TournamentList;

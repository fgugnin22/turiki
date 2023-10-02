import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { useAppSelector } from "../shared/rtk/store";
import { useState } from "react";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { Team } from "../helpers/transformMatches";
import React from "react";
const TournamentList = () => {
  const [createBracket] = tournamentAPI.useCreateBracketMutation();
  const [initializeMatches] = tournamentAPI.useInitializeMatchesMutation();
  const [fetchTeamById] = tournamentAPI.useLazyGetTeamByIdQuery();
  const { data, error, isLoading, isSuccess } =
    tournamentAPI.useGetAllTournamentsQuery(null);
  const [teamIds, setTeamIds] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
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
  const handleManagingClick = (e: MouseEvent) => {
    e.stopPropagation();
  };
  const { userDetails } = useAppSelector((state) => state.user);
  return (
    <Layout>
      {
        <section>
          <h1 className="text-5xl text-center mt-8">Турниры</h1>
          {isSuccess && data?.length > 0 ? (
            <div className="m-auto mt-12 w-[70vw]">
              {data?.map((tourn, index) => (
                <div className="flex space-x-2" key={index}>
                  <Link
                    to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                      id: data[index]["id"]
                    })}
                    className={`shadow ${
                      userDetails?.is_staff ? "w-[55vw]" : "w-[70vw]"
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

                    {/* {userDetails?.is_staff && (
                    <>
                      <div>
                        <button
                          onClick={() => createBracket(tourn.id)}
                          className="p-2 bg-zinc-400"
                        >
                          Create Bracket
                        </button>
                        <button
                          onClick={() => initializeMatches(tourn.id)}
                          className="p-2 ml-auto bg-zinc-400"
                        >
                          Initialize Matches
                        </button>
                      </div>
                      <div className="ml-auto flex w-1/3">
                        {teams[index] && (
                          <div
                            className="self-end mt-auto"
                            key={teams[index].id}
                          >
                            <RegisterTeamModal
                              tournamentId={tourn.id}
                              team={teams[index]}
                            />
                          </div>
                        )}
                        <div className="flex flex-col ml-auto self-end border-4 border-blue-800 rounded">
                          <button
                            id={String(index)}
                            onClick={handleTeamSubmit}
                            className="p-2 bg-zinc-400 text-sm h-10 w-52 ml-auto"
                          >
                            Найти команду
                          </button>
                          <input
                            id={String(index)}
                            value={teamIds[index]}
                            onChange={handleChange}
                            className="h-10 w-52 text-xl ml-auto"
                            type="number"
                            placeholder="Введите id команды"
                          />
                        </div>
                      </div>
                    </>
                  )} */}
                  </Link>
                  {userDetails?.is_staff && (
                    <button
                      onClick={handleManagingClick}
                      className="block rounded h-24 border p-3"
                    >
                      Управление
                    </button>
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

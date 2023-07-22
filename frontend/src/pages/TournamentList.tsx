import { tournamentAPI } from "../rtk/tournamentAPI";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { useAppSelector } from "../rtk/store";
import { useState } from "react";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { Team } from "../helpers/transformMatches";
const TournamentList = () => {
    const [createBracket] = tournamentAPI.useCreateBracketMutation();
    const [initializeMatches] = tournamentAPI.useInitializeMatchesMutation();
    const [fetchTeamById] = tournamentAPI.useLazyGetTeamByIdQuery();
    const { data, error, isLoading, isSuccess } =
        tournamentAPI.useGetAllTournamentsQuery(null);
    const [teamIds, setTeamIds] = useState<number[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        console.log(teamIds);
        setTeamIds((prev) => {
            prev[Number(target.id)] = Number(target.value);
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

    const { userDetails } = useAppSelector((state) => state.user);
    return (
        <Layout>
            <div>TournamentList</div>
            {isSuccess && data?.length > 0 ? (
                data?.map((tourn, index: number) => (
                    <div
                        className="p-3 text-center my-1 bg-slate-300 flex flex-row flex-wrap"
                        key={index}
                    >
                        <Link
                            className="text-lg h-12 w-[60%] block border-4 border-blue-800 rounded m-4"
                            to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                                id: data[index]["id"]
                            })}
                        >
                            {tourn.name}; prize: {tourn.prize} teams:{" "}
                            {tourn.teams.length} status: {tourn.status}
                        </Link>
                        {userDetails?.is_staff && (
                            <>
                                <div className=" text-sm border-4 border-blue-800 rounded h-12 w-1/3 my-4 ml-auto mr-4 flex">
                                    <button
                                        onClick={() => createBracket(tourn.id)}
                                        className="p-2 bg-zinc-400"
                                    >
                                        Create Bracket
                                    </button>
                                    <button
                                        onClick={() =>
                                            initializeMatches(tourn.id)
                                        }
                                        className="p-2 ml-auto bg-zinc-400"
                                    >
                                        Initialize Matches
                                    </button>
                                </div>
                                {teams[index] && (
                                    <RegisterTeamModal
                                        tournamentId={tourn.id}
                                        team={teams[index]}
                                    />
                                )}
                                <div className="flex flex-col ml-auto self-center border-4 border-blue-800 rounded">
                                    <button
                                        id={String(index)}
                                        onClick={handleTeamSubmit}
                                        className="p-2 bg-zinc-400 text-sm h-10 w-48 ml-auto"
                                    >
                                        Найти команду
                                    </button>
                                    <input
                                        id={String(index)}
                                        value={teamIds[index]}
                                        onChange={handleChange}
                                        className="h-10 w-48 text-xl ml-auto"
                                        type="text"
                                        placeholder="Введите id команды"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-xl p-2 bg-slate-300">Турниров нет!</p>
            )}
        </Layout>
    );
};

export default TournamentList;

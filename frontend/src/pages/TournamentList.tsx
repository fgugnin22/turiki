import { tournamentAPI } from "../rtk/tournamentAPI";
import {Layout} from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
const TournamentList = () => {
    const { data, error, isLoading, isSuccess } =
        tournamentAPI.useGetAllTournamentsQuery(null);

    return (
        <Layout>
            <div>TournamentList</div>
            {isSuccess && data?.length > 0 ? (
                data?.map((tourn, index: number) => (
                    <Link
                        key={index}
                        className="p-3 text-center my-1 bg-slate-300"
                        to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({id: data[index]["id"]})}
                    >
                        {tourn.name}; prize: {tourn.prize} teams: {tourn.teams.length} status: {tourn.status}
                    </Link>
                ))
            ) : (
                <p className="text-xl p-2 bg-slate-300">Турниров нет!</p>
            )}
        </Layout>
    );
};

export default TournamentList;

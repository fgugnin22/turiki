import React from "react";
import { tournamentAPI } from "../rtk/tournamenAPI";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
const TournamentList = () => {
    const { data, error, isLoading, isSuccess } =
        tournamentAPI.useGetAllTournamentsQuery({});
    console.log(data);

    return (
        <Layout>
            <div>TournamentList</div>
            {data?.length > 0 ? (
                data.map((tourn, index) => (
                    <Link
                        key={index}
                        className="p-3 text-center my-1 bg-slate-300"
                        to={`/tournament/${index + 1}`}
                    >
                        {tourn.name}; prize: {tourn.prize} teams: {tourn.teams.length}
                    </Link>
                ))
            ) : (
                <p className="text-xl p-2 bg-slate-300">Турниров нет!</p>
            )}
        </Layout>
    );
};

export default TournamentList;

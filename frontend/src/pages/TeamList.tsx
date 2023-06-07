import React from "react";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { ROUTES } from "../RouteTypes";

const TeamList = () => {
    const {
        data: teamList,
        isError,
        isLoading,
        isSuccess
    } = tournamentAPI.useTeamListQuery(null);
    return (
        <Layout>
            {isSuccess ? (
                teamList.map((team: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-300">
                        <Link
                            to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({
                                id: team.id
                            })}
                        >
                            {team.name}
                        </Link>
                    </div>
                ))
            ) : (
                <p>Loading....</p>
            )}
        </Layout>
    );
};

export default TeamList;

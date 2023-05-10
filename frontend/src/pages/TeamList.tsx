import React from "react";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamenAPI";
import { Link } from "react-router-dom";

const TeamList = () => {
    const {data: teamList, isError, isLoading, isSuccess} = tournamentAPI.useTeamListQuery({})
    console.log(teamList)
    return <Layout>
        {
            isSuccess ? (teamList.map(
                (team, i) => (
                    <div key={i} className="p-3 bg-slate-300">{team.name}</div>
                )
            )) : (<p>Loading....</p>)
        }
    </Layout>;
};

export default TeamList;

import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
const Match = () => {
    const params = useParams();
    const {data: match, isSuccess, isError} = tournamentAPI.useGetMatchByIdQuery({ id: params.id });
    return (
        <Layout>
            <div>Match {isSuccess ? match.id : "loading or error"}</div>
            <div>{isSuccess ? match.participants[0].team.name : "loading or error"}</div>
            <div>{isSuccess ? match.participants[1].team.name : "loading or error"}</div>
        </Layout>
    );
};

export default Match;

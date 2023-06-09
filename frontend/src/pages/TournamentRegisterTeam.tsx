import React, { useState } from "react";
import Layout from "../hocs/Layout.jsx";
import { useAppSelector } from "../rtk/store.js";
import { tournamentAPI } from "../rtk/tournamentAPI.js";
import { useTypedParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "../RouteTypes.js";
import RegisterTeamModal from "../components/RegisterTeamModal.js";

const TournamentRegisterTeam = () => {
    return (
        <Layout>
            <div className="relative">
                <RegisterTeamModal />
            </div>
        </Layout>
    );
};

export default TournamentRegisterTeam;

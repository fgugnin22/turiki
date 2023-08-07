import React, { useState } from "react";
import {Layout} from "../processes/Layout.js";
import { useAppSelector } from "../rtk/store.js";
import { tournamentAPI } from "../rtk/tournamentAPI.js";
import { useTypedParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "../app/RouteTypes.js";
import RegisterTeamModal from "../features/RegisterTeamModal.js";

const TournamentRegisterTeam = () => {
    return (
        <Layout>
            <div className="relative">
                {/* <RegisterTeamModal /> */}
            </div>
        </Layout>
    );
};

export default TournamentRegisterTeam;

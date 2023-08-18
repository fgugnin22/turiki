import React from "react";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { useNavigate, useParams } from "react-router-dom";
import Bracket from "../shared/Bracket";
import { ROUTES } from "../app/RouteTypes";

const BracketPage = () => {
    const navigate = useNavigate();
    const { data: tournament, isSuccess } =
        tournamentAPI.useGetTournamentByIdQuery({
            id: useParams().id!
        });
    const params = useParams();
    return (
        // <Layout>
        <>
            <div>BracketPage</div>
            <button
                className="p-3 bg-slate-700 hover:bg-slate-900 transition-colors flex items-center text-white justify-center"
                onClick={() => {
                    navigate(
                        ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                            id: Number(params.id!)
                        })
                    );
                }}
            >
                На страницу турнира
            </button>
            {isSuccess && <Bracket tournament={tournament} />}
        </>
        // </Layout>
    );
};

export default BracketPage;

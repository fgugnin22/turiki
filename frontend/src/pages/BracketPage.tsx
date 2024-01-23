import React from "react";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Link, useParams } from "react-router-dom";
import Bracket from "../shared/Bracket";
import { ROUTES } from "../shared/RouteTypes";

const BracketPage = () => {
  const { data: tournament, isSuccess } =
    tournamentAPI.useGetTournamentByIdQuery({
      id: useParams().id!
    });
  const params = useParams();
  return (
    <Layout>
      <div className="w-full flex flex-col items-start">
        <Link
          className="w-full p-3 bg-slate-700 hover:bg-slate-900 transition-colors flex items-center text-white justify-center"
          to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
            id: Number(params.id!)
          })}
        >
          На страницу турнира
        </Link>
        {tournament && <Bracket tournament={tournament} />}
      </div>
    </Layout>
  );
};

export default BracketPage;

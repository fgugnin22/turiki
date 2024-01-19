import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import { useAppSelector } from "../shared/rtk/store";
import { useState } from "react";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { Team, Tournament } from "../helpers/transformMatches";
import React from "react";
import { useTournamentStatus } from "../hooks/useTournamentStatus";
const serverURL = import.meta.env.VITE_API_URL;

const TournamentList = () => {
  const { data, error, isLoading, isSuccess } =
    tournamentAPI.useGetAllTournamentsQuery(null);
  return (
    <Layout>
      {
        <section>
          <h2
            data-content="Турниры"
            className="before:text-[44px] before:inset-0  w-full text-center text-[44px] before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
          >
            Турниры
          </h2>
          {isSuccess && data?.length > 0 ? (
            <div className="mx-auto mt-12 text-lightgray">
              {data?.map((tourn, index) => {
                const statusString = useTournamentStatus(tourn.status);
                return (
                  <div className="flex gap-x-2 text-black" key={index}>
                    <Link
                      to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                        id: data[index]["id"]
                      })}
                      className={`shadow mx-auto w-full relative mb-4 hover:bg-turquoise hover:bg-opacity-30 transition h-24 bg-transparent
                                         flex text-center justify-between  items-center rounded-[10px] after:absolute 
                                         before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
                                       after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                                         before:z-10 z-20 before:bg-dark before:rounded-[9px] hover:before:bg-opacity-80 hover:before:transition active:before:bg-opacity-50`}
                    >
                      <div className=" w-1/5 h-full flex items-center border-r border-lightblue z-30">
                        <p
                          data-content={tourn.name}
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow"
                        >
                          {tourn.name}
                        </p>
                      </div>
                      <p className="z-30 relative -top-[1px]">
                        <span
                          data-content="Призовой фонд: "
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 leading-6"
                        >
                          Призовой фонд:{" "}
                        </span>

                        <span
                          data-content={tourn.prize}
                          className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-30 leading-6"
                        >
                          {tourn.prize}
                        </span>
                      </p>
                      <p
                        data-content={`${tourn.teams.length}/${
                          2 ** tourn.max_rounds
                        } Команд`}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30"
                      >
                        Команд: {tourn.teams.length}/{2 ** tourn.max_rounds}
                      </p>
                      <p
                        data-content={statusString}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[180px]"
                      >
                        {statusString}
                      </p>
                      <p
                        data-content={`Раундов: ${tourn.max_rounds}`}
                        className="before:text-lg before:inset-0 text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] z-30 min-w-[13%]"
                      >
                        Раундов: {tourn.max_rounds}
                      </p>
                      <img
                        src={`${serverURL}/assets/img/forward.svg`}
                        className="z-30 mr-8 neonshadow"
                        alt=""
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      }
    </Layout>
  );
};

export default TournamentList;

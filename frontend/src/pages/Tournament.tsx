import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Team } from "../helpers/transformMatches.js";
import { Layout } from "../processes/Layout.js";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../app/RouteTypes";
import RegisterTeamModal from "../features/RegisterTeamModal";
import ButtonMain from "../shared/ButtonMain";
import { useState } from "react";
export interface IMatch {
  id: number;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Team[];
}

export const Tournament = () => {
  const params = useParams();
  const tournId = Number(params["id"]);
  const { userDetails: user } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: tournament,
    error,
    isLoading,
    isSuccess
  } = tournamentAPI.useGetTournamentByIdQuery({
    id: tournId!
  });
  const isTeamNotRegistered =
    user &&
    isSuccess &&
    tournament &&
    !tournament.teams.some((team: Team) => Number(team.id) === user.team);
  const { data: team } = tournamentAPI.useGetTeamByIdQuery(user?.team, {
    skip: !isTeamNotRegistered
  });

  return (
    <Layout>
      {isSuccess && (
        <>
          <div className=" px-12 bg-gradient-to-b from-slate-700 to-dark text-lightgray flex align-bottom pt-56 flex-wrap">
            <div className=" w-1/2 bg-transparent flex flex-col gap-4">
              <p>
                {tournament.status} - {/* tournament.starts*/}
                {"еще столько то минут"}
              </p>
              <p>{tournament.name}</p>
            </div>
            <div className="w-1/2 bg-transparent flex flex-wrap justify-end">
              <p className="w-full text-right">
                До конца регистрации:{" "}
                <span className=" text-lightblue">столько то минут</span>
              </p>
              {isTeamNotRegistered && (
                <RegisterTeamModal tournamentId={tournId} team={team!} />
              )}
              <button className=" rounded-[10px] bg-lightgray p-4 ml-2 relative"></button>
            </div>
            <div className="w-full">
              <div className=" flex justify-center gap-12">
                <a className=" underline text-turquoise" href="">
                  Обзор
                </a>
                <a className=" underline text-turquoise" href="">
                  Сетка
                </a>
                <a className=" underline text-turquoise" href="">
                  Участники
                </a>
                <a className=" underline text-turquoise" href="">
                  Правила
                </a>
                <a className=" underline text-lightblue" href="">
                  Мб еще ссылка
                </a>
              </div>
            </div>
          </div>
          <div className=" w-full h-[1px] bg-lightgray neonshadow mt-2"></div>

          <div className=" px-12 bg-gradient-to-b from-dark to-slate-700 grow flex items-center justify-center text-lightgray text-5xl">
            Контент ссылки
          </div>
        </>
      )}
    </Layout>
  );
};

export default Tournament;

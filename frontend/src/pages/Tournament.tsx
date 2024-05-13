import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import {
  Match,
  Participant,
  Team,
  Tournament as ITournament,
  INotification
} from "../helpers/transformMatches.js";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../shared/RouteTypes";
import RegisterTeamModal from "../features/RegisterTeamModal";
import { useEffect, useState } from "react";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../shared/rtk/user";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import ButtonSecondary from "../shared/ButtonSecondary";
import Bracket from "../shared/Bracket";
import { useTournamentStatus } from "../hooks/useTournamentStatus";
import TournamentTeamPlayerList from "../features/TournamentTeamPlayerList";
import TriangleLoader from "../shared/TriangleLoader";
import NotificationElem from "../features/NotificationElem";
import TournamentResultTeam from "../features/TournamentResultTeam";
import TournamentOverview from "../widgets/TournamentOverview";
import ButtonMain from "../shared/ButtonMain";

const serverURL = import.meta.env.VITE_API_URL;

export interface IMatch {
  id: number;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Team[];
}

const sortTeamByPlacement = (tournament?: ITournament): Team[] => {
  if (!tournament) {
    return [];
  }
  return [...tournament.teams].sort((team1: Team, team2: Team) => {
    const matches = [...tournament.matches];
    const bestMatch1 = matches
      .sort((a: Match, b: Match) => b.id - a.id)
      .find(
        (m: Match) =>
          m.participants.findIndex(
            (p: Participant) => p.team.id === team1?.id
          ) !== -1
      );

    const placement1 =
      Number(bestMatch1?.name) +
      (bestMatch1?.participants.find(
        (p: Participant) => p.team.id === team1?.id
      )?.result_text === "LOST"
        ? 1
        : 0);
    const bestMatch2 = matches
      .sort((a: Match, b: Match) => b.id - a.id)
      .find(
        (m: Match) =>
          m.participants.findIndex(
            (p: Participant) => p.team.id === team2?.id
          ) !== -1
      );

    const placement2 =
      Number(bestMatch2?.name) +
      (bestMatch2?.participants.find(
        (p: Participant) => p.team.id === team2?.id
      )?.result_text === "LOST"
        ? 1
        : 0);

    return placement1 - placement2;
  });
};

export const Tournament = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [page, setPage] = useState(0);

  const notifications = tournamentAPI.useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 10000
  });

  const ongoingMatch = tournamentAPI.useGetOngoingMatchQuery(null);

  useEffect(() => {
    if (state && code) {
      dispatch(googleAuthenticate({ state, code }));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
      }
    }
  }, [location, isAuthenticated]);
  const dispatch = useAppDispatch();
  const state = getParameterByName("state");
  const code = getParameterByName("code"); //get code and state from google oauth2
  const params = useParams();

  const tournId = Number(params["id"]);
  const { userDetails: user } = useAppSelector((state) => state.user);
  const { data: tournament, isError } = tournamentAPI.useGetTournamentByIdQuery(
    {
      id: tournId!
    }
  );
  const isTeamNotRegistered =
    user &&
    tournament &&
    !tournament.teams.some((team: Team) => Number(team.id) === user.team);

  const { data: team } = tournamentAPI.useGetTeamByIdQuery(user?.team, {
    skip: user?.team === undefined
  });

  const statusString = useTournamentStatus(tournament?.status);
  const date = new Date(tournament?.reg_starts ?? 0);
  const section = params["*"];
  const navigate = useNavigate();

  const sortedTeams = sortTeamByPlacement(tournament);

  if (isError) {
    navigate(ROUTES.NO_MATCH404.path);
  }
  return (
    <div className="flex flex-col bg-dark grow justify-start">
      <div className="mx-auto w-[310px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between">
        <Header />
      </div>
      {tournament ? (
        <div className="min-h-screen">
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent, #141318 90%), url(${serverURL}/media/img/siege1.webp)`
            }}
            className=" text-lightgray flex align-bottom pt-56 flex-wrap bg-cover bg-center"
          >
            <div className="mx-auto w-full lg:w-4/5 xl:w-[1100px] flex align-bottom flex-wrap">
              <div className=" w-full lg:w-1/2 bg-transparent flex flex-col">
                <p className=" text-white opacity-50 leading-6 text-center lg:text-left">
                  {(tournament.status === "REGISTRATION_CLOSED_BEFORE_REG" &&
                    `Регистрация открется ${date.toLocaleDateString(
                      "ru"
                    )} в ${date.toLocaleTimeString("ru")}`) ||
                    statusString}
                  {}
                </p>
                <p
                  data-content={tournament.name}
                  className="before:w-full text-2xl leading-7 font-medium lg:w-4/5 block before:top-0 before:bottom-0 before:left-0 before:right-0 
                  before:text-center text-center before:lg:text-left lg:text-left before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                >
                  {tournament.name}
                </p>
              </div>
              <div className="w-full mt-1 lg:mt-0 justify-center lg:w-1/2 bg-transparent flex flex-wrap lg:justify-end">
                {(user?.team ?? false) &&
                  ((isTeamNotRegistered &&
                    tournament.status === "REGISTRATION_OPENED") ||
                    tournament.status === "CHECK_IN") && (
                    <RegisterTeamModal
                      isTeamNotRegistered={isTeamNotRegistered ?? false}
                      tournamentStatus={tournament.status}
                      tournamentId={tournId}
                      team={team!}
                      maxPlayers={tournament.max_players_in_team}
                    />
                  )}
                {ongoingMatch.data && (
                  <Link
                    to={ROUTES.MATCHES.MATCH_BY_ID.buildPath({
                      id: ongoingMatch.data.id
                    })}
                  >
                    <ButtonMain className="font-semibold text-sm py-[6px] focus:py-1 active:py-1">
                      Перейти к текущему матчу!
                    </ButtonMain>
                  </Link>
                )}
                <ButtonSecondary
                  onClick={async () =>
                    await navigator.clipboard.writeText(location.href)
                  }
                  className=" bg-lightblue z-50 w-[32px] h-[32px] ml-2 flex items-center justify-center fill-lightblue hover:fill-turquoise transition neonshadow"
                >
                  <svg
                    className="z-[99] relative left-[-1px]"
                    viewBox="0,0,256,256"
                    width="22px"
                    height="22px"
                  >
                    <g
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(10.66667,10.66667)">
                        <path d="M18,2c-1.65685,0 -3,1.34315 -3,3c0.00061,0.18815 0.01892,0.37583 0.05469,0.56055l-7.11523,4.15039c-0.54194,-0.45909 -1.22919,-0.71102 -1.93945,-0.71094c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c0.70916,-0.00139 1.3949,-0.25396 1.93555,-0.71289l7.11914,4.15234c-0.03577,0.18472 -0.05408,0.3724 -0.05469,0.56055c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3c-0.70983,0.00093 -1.39634,0.25353 -1.9375,0.71289l-7.11719,-4.15234c0.03577,-0.18472 0.05408,-0.3724 0.05469,-0.56055c-0.00061,-0.18815 -0.01892,-0.37583 -0.05469,-0.56055l7.11523,-4.15039c0.54194,0.45909 1.22919,0.71102 1.93945,0.71094c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3z"></path>
                      </g>
                    </g>
                  </svg>
                </ButtonSecondary>
              </div>
              <div className="w-full font-medium text-xs justify-evenly lg:text-base flex lg:justify-start lg:gap-24 items-center mt-5">
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "underline underline-offset-[13px] !text-lightblue"
                        : ""
                    }` +
                    "  text-lightgray transition hover:!text-turquoise relative z-50"
                  }
                  end
                  to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.buildPath({
                    id: tournId
                  })}
                >
                  Обзор
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "underline underline-offset-[13px] !text-lightblue"
                        : ""
                    }` + "  text-lightgray transition hover:!text-turquoise"
                  }
                  to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.BRACKET.buildPath({
                    id: tournId
                  })}
                >
                  Сетка
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "underline underline-offset-[13px] !text-lightblue"
                        : ""
                    }` + "  text-lightgray transition hover:!text-turquoise"
                  }
                  to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.PARTICIPANTS.buildPath(
                    {
                      id: tournId
                    }
                  )}
                >
                  Участники
                </NavLink>
                {tournament.status === "PLAYED" && (
                  <NavLink
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "underline underline-offset-[13px] !text-lightblue"
                          : ""
                      }` + "  text-lightgray transition hover:!text-turquoise"
                    }
                    to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.RESULTS.buildPath({
                      id: tournId
                    })}
                  >
                    Результаты
                  </NavLink>
                )}
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "underline underline-offset-[13px] !text-lightblue"
                        : ""
                    }` + "  text-lightgray transition hover:!text-turquoise"
                  }
                  to={ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.RULES.buildPath({
                    id: tournId
                  })}
                >
                  Правила
                </NavLink>
              </div>
            </div>
          </div>
          <div className=" w-full h-[1px] bg-gradient-to-r from-lightblue to-turquoise neonshadow mt-2"></div>

          {section === "bracket" ? (
            <div className="mx-auto max-w-full flex flex-col justify-between">
              <Bracket tournament={tournament} />{" "}
            </div>
          ) : section === "participants" ? (
            <>
              <div className=" mx-4 lg:mx-auto pt-12 grid sm:grid-cols-2 gap-10 xl:grid-cols-3 lg:w-full lg:w-4/5 xl:w-[1100px] min-h-[378px]">
                {sortedTeams.slice(page * 12, page * 12 + 12).map((team) => {
                  return (
                    <TournamentTeamPlayerList
                      key={team.name + "team"}
                      tournamentId={tournament.id}
                      team={team}
                    />
                  );
                })}
              </div>
              <div className="w-full flex justify-center items-center mt-6 gap-[10px] text-turquoise text-base font-medium">
                <button
                  onClick={() =>
                    setPage((p) => {
                      return Math.max(p - 1, 0);
                    })
                  }
                >
                  <svg width="7" height="9" viewBox="0 0 7 9" fill="none">
                    <path
                      d="M0.859853 5.25251C0.40462 4.85411 0.40462 4.14589 0.859853 3.74749L4.62594 0.451531C5.2725 -0.114319 6.28452 0.344842 6.28452 1.20405V7.79596C6.28452 8.65516 5.2725 9.11432 4.62594 8.54847L0.859853 5.25251Z"
                      fill="#21DBD3"
                    />
                  </svg>
                </button>
                <span>
                  {page + 1} / {Math.ceil(tournament.teams.length / 12)}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => {
                      return Math.min(
                        p + 1,
                        Math.ceil(tournament.teams.length / 12) - 1
                      );
                    })
                  }
                >
                  <svg
                    width="6"
                    height="9"
                    viewBox="0 0 6 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.42482 3.74749C5.88005 4.14589 5.88005 4.85411 5.42482 5.25251L1.65873 8.54847C1.01217 9.11432 0.000151634 8.65516 0.000151634 7.79595L0.000151634 1.20404C0.000151634 0.344841 1.01216 -0.11432 1.65873 0.45153L5.42482 3.74749Z"
                      fill="#21DBD3"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : section === "rules" ? (
            <div className="flex flex-col">
              <h2 className="mx-auto bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent mt-[70px] text-2xl font-medium">
                Скачать файл
              </h2>
              <p
                className="mx-auto bg-gradient-to-r from-lightblue
               to-turquoise bg-clip-text text-transparent 
              mt-4 text-base font-medium w-[343px] text-center mb-4"
              >
                Файл содержит правила, которым должны следовать участники
                турнира
              </p>
              <a
                className="w-[170px] h-[170px] rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:transition hover:before:bg-opacity-80 before:rounded-[8px] flex items-center justify-center"
                target="_blank"
                href={serverURL + "/media/files/file.pdf"}
              >
                <svg
                  className="relative z-50"
                  width="66"
                  height="116"
                  viewBox="0 0 66 116"
                  fill="none"
                >
                  <path
                    d="M3 48.7665L3 62.5969C3 64.6929 3.79018 66.7031 5.1967 68.1852C6.60322 69.6674 8.51088 70.5 10.5 70.5H55.5C57.4891 70.5 59.3968 69.6674 60.8033 68.1852C62.2098 66.7031 63 64.6929 63 62.5969V48.7665M33.0042 3V47.7842M33.0042 47.7842L50.147 30.6724M33.0042 47.7842L15.8613 30.6724"
                    stroke="url(#paint0_linear_0_1)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.17045 116V89.8182H10.017C12.071 89.8182 13.75 90.1889 15.054 90.9304C16.3665 91.6634 17.3381 92.6562 17.9688 93.9091C18.5994 95.1619 18.9148 96.5597 18.9148 98.1023C18.9148 99.6449 18.5994 101.047 17.9688 102.308C17.3466 103.57 16.3835 104.575 15.0795 105.325C13.7756 106.067 12.1051 106.438 10.0682 106.438H3.72727V103.625H9.96591C11.3722 103.625 12.5014 103.382 13.3537 102.896C14.206 102.411 14.8239 101.754 15.2074 100.928C15.5994 100.092 15.7955 99.1506 15.7955 98.1023C15.7955 97.054 15.5994 96.1165 15.2074 95.2898C14.8239 94.4631 14.2017 93.8153 13.3409 93.3466C12.4801 92.8693 11.3381 92.6307 9.91477 92.6307H4.34091V116H1.17045ZM32.1016 116H24.022V89.8182H32.4595C34.9993 89.8182 37.1726 90.3423 38.9794 91.3906C40.7862 92.4304 42.1712 93.9261 43.1342 95.8778C44.0973 97.821 44.5788 100.148 44.5788 102.858C44.5788 105.585 44.093 107.933 43.1215 109.902C42.1499 111.862 40.7351 113.371 38.8771 114.428C37.0192 115.476 34.7607 116 32.1016 116ZM27.1925 113.188H31.897C34.0618 113.188 35.8558 112.77 37.2791 111.935C38.7024 111.099 39.7635 109.911 40.4624 108.368C41.1612 106.825 41.5107 104.989 41.5107 102.858C41.5107 100.744 41.1655 98.9247 40.4751 97.3991C39.7848 95.8651 38.7536 94.6889 37.3814 93.8707C36.0092 93.044 34.3004 92.6307 32.255 92.6307H27.1925V113.188ZM49.897 116V89.8182H65.5959V92.6307H53.0675V101.477H64.4197V104.29H53.0675V116H49.897Z"
                    fill="#18A3DC"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_0_1"
                      x1="55.5"
                      y1="3"
                      x2="3"
                      y2="71"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#21DBD3" />
                      <stop offset="1" stopColor="#18A3DC" />
                      <stop offset="1" stopColor="#18A3DC" />
                    </linearGradient>
                  </defs>
                </svg>
              </a>
            </div>
          ) : section === "results" ? (
            <div className="mx-auto flex flex-col w-full lg:w-4/5 xl:w-[1100px] text-lightblue">
              <div className="w-full px-4 h-12 flex items-center gap-[72px] lg:gap-24 border-b border-b-lightblue lg:text-lg">
                <p>#</p>
                <p>Команда</p>
              </div>
              {sortedTeams.map((t) => (
                <TournamentResultTeam
                  key={t.id + t.name}
                  team={t}
                  tournamentId={tournId}
                />
              ))}
            </div>
          ) : (
            <TournamentOverview tournament={tournament} />
          )}
        </div>
      ) : (
        <div className=" flex items-center justify-center">
          <TriangleLoader />
        </div>
      )}
      <div className="fixed bottom-4 right-4 flex flex-col-reverse gap-4 z-50">
        {notifications?.data?.map((n: INotification) => (
          <NotificationElem key={n.id} data={n} />
        ))}
      </div>
      <div className="mx-auto w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default Tournament;

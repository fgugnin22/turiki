import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Team } from "../helpers/transformMatches.js";
import { Layout } from "../processes/Layout.js";
import { Link, NavLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../shared/RouteTypes";
import RegisterTeamModal from "../features/RegisterTeamModal";
import ButtonMain from "../shared/ButtonMain";
import { useEffect, useState } from "react";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../shared/rtk/user";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import ButtonSecondary from "../shared/ButtonSecondary";
import Bracket from "../shared/Bracket";
const serverURL = import.meta.env.VITE_API_URL;

export interface IMatch {
    id: number;
    nextMatchId: number | null;
    tournamentRoundText: string;
    startTime: string;
    state: string;
    participants: Team[];
}

export const Tournament = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const state = getParameterByName("state");
    const code = getParameterByName("code"); //get code and state from google oauth2
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
        <div className="flex min-h-screen flex-col bg-dark grow justify-start">
            <div className="mx-auto w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between">
                <Header />
            </div>
            {isSuccess && (
                <>
                    <div
                        style={{
                            backgroundImage: `linear-gradient(to bottom, transparent, #141318 90%), url(${serverURL}/assets/img/siege1.png)`
                        }}
                        className=" text-lightgray flex align-bottom pt-56 flex-wrap bg-cover bg-center"
                    >
                        <div className="mx-auto w-full lg:w-4/5 xl:w-[1100px] flex align-bottom flex-wrap">
                            <div className=" w-1/2 bg-transparent flex flex-col">
                                <p className=" text-white opacity-50 leading-6">
                                    {(tournament.status ===
                                        "REGISTRATION_CLOSED_BEFORE_REG" &&
                                        "Регистрация ещё закрыта") ||
                                        (tournament.status ===
                                            "REGISTRATION_OPENED" &&
                                            "Регистрация открыта") ||
                                        (tournament.status ===
                                            "REGISTRATION_CLOSED_AFTER_REG" &&
                                            "Регистрация уже закрыта") ||
                                        (tournament.status === "CHECK_IN" &&
                                            "Подтверждение(check-in)") ||
                                        (tournament.status ===
                                            "CHECK_IN_CLOSED" &&
                                            "Скоро начнётся") ||
                                        (tournament.status === "ACTIVE" &&
                                            "Активен") ||
                                        (tournament.status === "PLAYED" &&
                                            "Сыгран") ||
                                        "fgugnin22 где то ошибся"}{" "}
                                    - {"еще столько то минут"}
                                </p>
                                <p
                                    data-content={tournament.name}
                                    className="before:w-full text-2xl leading-7 font-medium w-4/5 block before:inset-0 before:text-left text-left before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                                >
                                    {tournament.name}
                                </p>
                            </div>
                            <div className="w-1/2 bg-transparent flex flex-wrap justify-end">
                                <p className="w-full text-right text-white">
                                    <span className=" opacity-50">
                                        До конца регистрации:{" "}
                                    </span>
                                    <span className=" text-lightblue">
                                        00:12:32
                                    </span>
                                </p>
                                {isTeamNotRegistered && (
                                    <RegisterTeamModal
                                        tournamentId={tournId}
                                        team={team!}
                                        maxPlayers={
                                            tournament.max_players_in_team
                                        }
                                    />
                                )}
                                <ButtonSecondary className=" bg-lightblue z-50 w-[32px] h-[32px] ml-2 flex items-center justify-center fill-lightblue hover:fill-turquoise transition neonshadow">
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
                            <div className="w-full font-medium text-base flex justify-center gap-12 items-center">
                                <NavLink
                                    className={({ isActive }) =>
                                        `${
                                            isActive
                                                ? "underline underline-offset-[9px] !text-lightblue"
                                                : ""
                                        }` +
                                        "  text-lightgray transition hover:!text-turquoise"
                                    }
                                    to="./"
                                >
                                    Обзор
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `${
                                            isActive
                                                ? "underline underline-offset-[9px] !text-lightblue"
                                                : ""
                                        }` +
                                        "  text-lightgray transition hover:!text-turquoise"
                                    }
                                    to="."
                                >
                                    Сетка
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `${
                                            isActive
                                                ? "underline underline-offset-[9px] !text-lightblue"
                                                : ""
                                        }` +
                                        "  text-lightgray transition hover:!text-turquoise"
                                    }
                                    to="./participants"
                                >
                                    Участники
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `${
                                            isActive
                                                ? "underline underline-offset-[9px] !text-lightblue"
                                                : ""
                                        }` +
                                        "  text-lightgray transition hover:!text-turquoise"
                                    }
                                    to="./rules"
                                >
                                    Правила
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `${
                                            isActive
                                                ? "underline underline-offset-[9px] !text-lightblue"
                                                : ""
                                        }` +
                                        "  text-lightgray transition hover:!text-turquoise"
                                    }
                                    to="./somewhere"
                                >
                                    Мб еще ссылка
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className=" w-full h-[1px] bg-gradient-to-r from-lightblue to-turquoise neonshadow mt-2"></div>
                    <div className="mx-auto grow flex flex-col justify-between">
                        <Bracket tournament={tournament} />
                    </div>
                </>
            )}
            <div className="mx-auto w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between">
                <Footer />
            </div>
        </div>
    );
};

export default Tournament;

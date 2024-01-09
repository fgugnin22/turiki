import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { logout } from "../shared/rtk/user";
const serverURL = import.meta.env.VITE_API_URL;
const Header = () => {
    const [isDropDownVisible, setIsDropDownVisible] = useState(false);
    const dispatch = useAppDispatch();
    const {
        userDetails,
        isAuthenticated,
        userDetails: user
    } = useAppSelector((state) => state.user);
    return (
        <header className="flex justify-between text-lightgray items-center h-[70px] relative gap-8">
            <Link className="" to={ROUTES.TOURNAMENTS.path}>
                <img
                    width="40"
                    height="40"
                    src={`${serverURL}/assets/img/logo.svg`}
                    alt="логотип"
                    className="neonshadow"
                />
            </Link>
            <div className="flex justify-between w-1/2 mt-[1px] mr-auto ">
                <Link
                    data-content="На главную"
                    className=" text-lightgray text-lg 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0 before:font-medium font-medium
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute neonshadow"
                    to={ROUTES.DASHBOARD.path}
                >
                    На главную
                </Link>
            </div>
            {isAuthenticated ? (
                <>
                    <div
                        className=" absolute flex flex-col
                        right-0 top-1"
                        role="menuitem"
                        onClick={() => setIsDropDownVisible((prev) => !prev)}
                    >
                        <div
                            className={
                                (isDropDownVisible &&
                                    "bg-turquoise bg-opacity-20 !rounded-b-none") +
                                " relative flex flex-row justify-between items-center gap-[20px] rounded-[10px] transition-colors hover:bg-turquoise hover:bg-opacity-20 py-2 px-3"
                            }
                        >
                            <img
                                src={
                                    userDetails?.image
                                        ? `${serverURL}/${userDetails.image}`
                                        : `${serverURL}/assets/img/userdefaultloggedin.svg`
                                }
                                alt=""
                                className=" rounded-full w-[45px] h-[45px]"
                            />
                            <span
                                data-content={userDetails?.name}
                                className="before:text-lg text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow"
                            >
                                {userDetails?.name}
                            </span>

                            <img
                                src={`${serverURL}/assets/img/accordion.svg`}
                                alt=""
                                className="neonshadow mt-[1px]"
                            />
                        </div>
                        {isDropDownVisible && (
                            <div
                                className={
                                    (isDropDownVisible &&
                                        "bg-turquoise bg-opacity-20") +
                                    " relative flex flex-col justify-between items-center rounded-b-[10px] transition-colors hover:bg-turquoise hover:bg-opacity-20 "
                                }
                            >
                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                    }}
                                    className="text-base font-medium text-left w-full grow py-[10px] hover:bg-turquoise hover:bg-opacity-20 transition px-4"
                                    role="menuitem"
                                >
                                    <span className=" hover:text-turquoise transition">
                                        Мой профиль
                                    </span>
                                </button>
                                <NavLink
                                    to={
                                        userDetails?.team
                                            ? ROUTES.TEAMS.TEAM_BY_ID.buildPath(
                                                  { id: userDetails.team }
                                              )
                                            : ROUTES.TEAMS.CREATE.buildPath({})
                                    }
                                    className={({ isActive }) =>
                                        "text-base font-medium text-left w-full grow py-[9px] hover:bg-turquoise hover:bg-opacity-20 transition px-4"
                                    }
                                    role="menuitem"
                                >
                                    <span className=" hover:text-turquoise transition">
                                        {userDetails?.team
                                            ? "Команда"
                                            : "Создать/найти команду"}
                                    </span>
                                </NavLink>
                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                    }}
                                    className="text-base font-medium text-left w-full grow py-[9px] hover:bg-turquoise hover:bg-opacity-20 transition px-4 rounded-b-[10px]"
                                    role="menuitem"
                                >
                                    <span className=" hover:text-turquoise transition">
                                        Выйти
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex justify-between items-center gap-3">
                    <Link
                        className=" flex gap-[19px] justify-between items-center rounded-[10px] hover:bg-turquoise hover:bg-opacity-20 active:bg-turquoise active:bg-opacity-60 h-[52px] pl-5 pr-5 neonshadow transition-colors"
                        to={ROUTES.LOGIN.path}
                        type="button"
                    >
                        <img
                            src={`${serverURL}/assets/img/defaultuser.svg`}
                            alt=""
                        />
                        <span
                            data-content="Вход"
                            className="before:text-lg text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)]"
                        >
                            Вход
                        </span>
                    </Link>
                    <span
                        data-content="/"
                        className="before:text-lg neonshadow font-black before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow scale-150 mx-2 mb-1"
                    >
                        /
                    </span>
                    <Link
                        to={ROUTES.REGISTER_ACCOUNT.path}
                        type="button"
                        data-content="Регистрация"
                        className="before:text-lg text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow rounded-[10px] hover:bg-turquoise hover:bg-opacity-20 h-[52px] px-4 flex items-center transition-colors
                        active:bg-turquoise active:bg-opacity-60"
                    >
                        <span className="">Регистрация</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;

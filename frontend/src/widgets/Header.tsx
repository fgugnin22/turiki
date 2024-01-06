import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Link } from "react-router-dom";
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
        <header className="flex justify-between text-lightgray items-center h-[70px]">
            <Link className="" to={ROUTES.TOURNAMENTS.path}>
                <img
                    width="40"
                    height="40"
                    src={`${serverURL}/assets/img/logo.svg`}
                    alt="логотип"
                    className="neonshadow"
                />
            </Link>
            <div className="flex justify-between w-1/2 mt-[1px]">
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
                        // to={ROUTES.DASHBOARD.path}
                        className=" flex justify-between items-center gap-[20px] rounded-[10px] transition-colors hover:bg-turquoise hover:bg-opacity-20 py-2 px-3 relative"
                        role="menuitem"
                        onClick={() => setIsDropDownVisible((prev) => !prev)}
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
                        {isDropDownVisible && (
                            <div className="absolute flex flex-col -bottom-20 right-0 gap-1 transition">
                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                    }}
                                    className=" bg-lightblue p-1 rounded-lg text-xs"
                                    role="menuitem"
                                >
                                    Мой профиль
                                </button>
                                <button
                                    // onClick={() => {
                                    //     dispatch(logout());
                                    // }}
                                    className=" bg-lightblue p-1 rounded-lg text-xs"
                                    role="menuitem"
                                >
                                    Найти команду/моя команда
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                    }}
                                    className=" bg-lightblue p-1 rounded-lg text-xs"
                                    role="menuitem"
                                >
                                    Выйти
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

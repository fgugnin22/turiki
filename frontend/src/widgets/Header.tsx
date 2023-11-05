import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { logout } from "../shared/rtk/user";

const Header = () => {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const dispatch = useAppDispatch();
  const {
    userDetails,
    isAuthenticated,
    userDetails: user
  } = useAppSelector((state) => state.user);
  return (
    <div>
      <nav className="bg-white dark:bg-gray-800  shadow ">
        <div className="px-8 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className=" flex items-center">
              <Link className="flex-shrink-0" to={ROUTES.TOURNAMENTS.path}>
                {/* <img
                  className="w-8 h-8"
                  src="/icons/rocket.svg"
                  alt="Workflow"
                /> */}
                <img
                  width="40"
                  height="40"
                  src="https://img.icons8.com/fluency/48/vuejs.png"
                  alt="логотип"
                />
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10 space-x-4">
                  <Link
                    className=" text-gray-800 focus:text-blue-700 focus:underline hover:text-blue-700 hover:underline w-full transition ease-in duration-200 text-center text-sm font-normal"
                    to={ROUTES.DASHBOARD.path}
                  >
                    На главную
                  </Link>
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <>
                {!userDetails?.team && (
                  <div className="flex ml-auto">
                    <Link
                      to={ROUTES.TEAMS.CREATE.path}
                      className=" text-gray-800 focus:text-blue-700 focus:underline hover:text-blue-700 hover:underline w-full transition ease-in duration-200 text-center text-sm font-normal"
                      role="menuitem"
                    >
                      <span className="flex flex-col">
                        Создать или найти команду
                      </span>
                    </Link>
                  </div>
                )}
                <div
                  className={`flex ${!userDetails?.team ? "ml-6" : "ml-auto"}`}
                >
                  <Link
                    to={ROUTES.DASHBOARD.path}
                    className="py-2 pl-3 pr-2  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-l-lg "
                    role="menuitem"
                  >
                    <span className="flex flex-col">{userDetails?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                    }}
                    className="py-2 pr-3 pl-2  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-r-lg "
                    role="menuitem"
                  >
                    Выйти
                  </button>
                </div>
              </>
            )}

            <div className="block">
              <div className="flex items-center ml-4 md:ml-6 ">
                {!isAuthenticated && (
                  <>
                    <Link
                      to={ROUTES.LOGIN.path}
                      type="button"
                      className="py-2 pl-3 pr-2  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-l-lg "
                    >
                      Войти
                    </Link>
                    <Link
                      to={ROUTES.REGISTER_ACCOUNT.path}
                      type="button"
                      className="py-2 pr-3 pl-2  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-r-lg "
                    >
                      Зарегистрироваться
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;

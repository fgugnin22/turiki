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
                  alt="vuejs"
                />
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10 space-x-4">
                  <Link
                    className="text-gray-300 transition-colors  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    to={ROUTES.DASHBOARD.path}
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>
            <div className="block">
              <div className="flex items-center ml-4 md:ml-6 ">
                {isAuthenticated ? (
                  <div className="relative ml-3">
                    <div className="relative inline-block text-left">
                      <div>
                        <button
                          onClick={() =>
                            setIsDropDownVisible((state) => !state)
                          }
                          type="button"
                          className="  flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                          id="options-menu"
                        >
                          <svg
                            width="20"
                            fill="currentColor"
                            height="20"
                            className="text-gray-800"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
                          </svg>
                        </button>
                      </div>
                      {isDropDownVisible && (
                        <div className="absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1 "
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <Link
                              to={ROUTES.DASHBOARD.path}
                              className="block  px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                              role="menuitem"
                            >
                              <span className="flex flex-col">
                                <span>Settings</span>
                              </span>
                            </Link>
                            <Link
                              to={ROUTES.DASHBOARD.path}
                              className="block  px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                              role="menuitem"
                            >
                              <span className="flex flex-col">
                                <span>Account</span>
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                dispatch(logout());
                              }}
                              className=" w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                              role="menuitem"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
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
            <div className="flex -mr-2 md:hidden">
              <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="w-8 h-8"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              to="/#"
            >
              Home
            </Link>
            <Link
              className="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium"
              to="/#"
            >
              Gallery
            </Link>
            <Link
              className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              to="/#"
            >
              Content
            </Link>
            <Link
              className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              to="/#"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import { logout } from "../rtk/user";
import { ROUTES } from "../app/RouteTypes";
const NavBar = () => {
    const dispatch = useAppDispatch();
    const { userDetails } = useAppSelector((state) => state.user);
    const { isAuthenticated, userDetails: user } = useAppSelector(
        (state) => state.user
    );
    const guestLinks = () => {
        return (
            <div className="md:flex items-center space-x-1">
                <Link className="py-5 px-3" to={ROUTES.LOGIN.path}>
                    Login
                </Link>

                <Link
                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 rounded transition duration-300"
                    to={ROUTES.REGISTER_ACCOUNT.path}
                >
                    Sign Up
                </Link>
            </div>
        );
    };
    const authLinks = () => {
        return (
            <div>
                {userDetails?.name}
                <a
                    className=""
                    onClick={() => {
                        dispatch(logout());
                    }}
                    href="#"
                >
                    , Logout
                </a>
                {user && !user.team ? (
                    <Link
                        className="py-2 mx-4 rounded-md px-3 bg-slate-300"
                        to={ROUTES.TEAMS.CREATE.path}
                    >
                        Create Team
                    </Link>
                ) : (
                    user?.team && (
                        <Link
                            className="py-2 mx-4 rounded-md px-3 bg-green-600"
                            // to={`/team/${user?.team}`}
                            to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({
                                id: user?.team
                            })}
                        >
                            My team
                        </Link>
                    )
                )}
            </div>
        );
    };

    return (
        <nav className="bg-gray-200 max-h-[65px]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="relative flex h-16 items-center justify-between">
                    <div>
                        <Link
                            className="py-5 px-3 text-gray-700 hover:text-gray-900 text-xl font-semibold"
                            to={ROUTES.TOURNAMENTS.path}
                        >
                            Turiki emae
                        </Link>
                        <Link
                            className="py-5 px-3 text-gray-700 hover:text-gray-900"
                            aria-current="page"
                            to={ROUTES.DASHBOARD.path}
                        >
                            Home
                        </Link>
                    </div>
                    {isAuthenticated ? authLinks() : guestLinks()}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

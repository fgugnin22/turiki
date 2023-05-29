import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import { logout } from "../rtk/user";
const NavBar = () => {
    const dispatch = useAppDispatch();
    const access = localStorage.getItem("access");
    const { isAuthenticated, user } = useAppSelector((state) => state.user);
    const guestLinks = () => {
        return (
            <div className="md:flex items-center space-x-1">
                <Link className="py-5 px-3" to="/login">
                    Login
                </Link>

                <Link
                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 rounded transition duration-300"
                    to="/signup"
                >
                    Sign Up
                </Link>
            </div>
        );
    };
    const authLinks = () => {
        return (
            <div>
                <a
                    className=""
                    onClick={() => {
                        dispatch(logout(access));
                    }}
                    href="#!"
                >
                    Logout
                </a>
                {user && !user.team ? <Link className="py-2 mx-4 rounded-md px-3 bg-slate-300" to="/team/create">
                    Create Team
                </Link> : <Link className="py-2 mx-4 rounded-md px-3 bg-green-600" to={`/team/${user?.team}`}>My team</Link>}
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
                            to="/tournaments"
                        >
                            Turiki emae
                        </Link>
                        <Link
                            className="py-5 px-3 text-gray-700 hover:text-gray-900"
                            aria-current="page"
                            to="/"
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

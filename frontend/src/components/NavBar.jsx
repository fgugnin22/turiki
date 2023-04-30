import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../rtk/user";
const NavBar = () => {
  const dispatch = useDispatch();
  const access = localStorage.getItem("access");
  const { isAuthenticated } = useSelector((state) => state.user);
  const guestLinks = () => {
    return (
      <div className="hidden md:flex items-center space-x-1">
        <Link className="py-5 px-3" to="/login">
          Login
        </Link>

        <Link
          className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
          to="/signup"
        >
          Sign Up
        </Link>
      </div>
    );
  };
  const authLinks = () => {
    return (
      <a
        className=""
        onClick={() => {
          console.log("logout");
          dispatch(logout(access));
        }}
        href="#!"
      >
        Logout
      </a>
    );
  };

  return (
    <nav className="bg-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div>
            <Link className="py-5 px-3 text-gray-700 hover:text-gray-900 text-xl font-semibold" to="/">
              Turiki emae
            </Link>
            <Link className="py-5 px-3 text-gray-700 hover:text-gray-900" aria-current="page" to="/">
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

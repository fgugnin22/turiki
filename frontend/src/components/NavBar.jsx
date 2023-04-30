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
      <>
        <li className="">
          <Link className="" to="/login">
            Login
          </Link>
        </li>
        <li className="">
          <Link className="" to="/signup">
            Sign Up
          </Link>
        </li>
      </>
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
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Link className="" to="/">
            Turiki emae
          </Link>

          <div className="" id="navbarSupportedContent">
            <ul className="">
              <li className="">
                <Link className="" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {isAuthenticated ? authLinks() : guestLinks()}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

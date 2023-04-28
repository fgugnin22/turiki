import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
// import {
//   checkAuthenticated,
//   load_user,
//   googleAuthenticate,
// } from "../actions/auth";
import { parseParams } from "../helpers/parseParams";
import { checkAuth, googleAuthenticate } from "../rtk/user";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();
  let location = useLocation();
  useEffect(() => {
    const values = parseParams(location.search); //get code and state from google oauth2
    const state = values.state ? values.state : null;
    const code = values.code ? values.code : null;
    if (state && code) {
      dispatch(googleAuthenticate(state, code));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
        console.log(access)
      }
    }
  }, [location]);
  return (
    <div>
      <NavBar />
      {props.children}
    </div>
  );
};

export default Layout;

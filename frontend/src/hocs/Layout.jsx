import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../rtk/user";
import { useDispatch } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();
  const state = getParameterByName('state');
  const code = getParameterByName('code'); //get code and state from google oauth2
  useEffect(() => {
    if (state && code) {
      dispatch(googleAuthenticate({state, code}));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
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

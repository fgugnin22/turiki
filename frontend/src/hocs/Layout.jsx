import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../rtk/user";
import { useDispatch, useSelector } from "react-redux";
const Layout = (props) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const state = getParameterByName("state");
  const code = getParameterByName("code"); //get code and state from google oauth2
  useEffect(() => {
    if (state && code) {
      dispatch(googleAuthenticate({ state, code }));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
      }
    }
  }, [location, isAuthenticated]);

  return (
    <div className="grid grid-cols-1 min-h-screen">
      <NavBar />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;

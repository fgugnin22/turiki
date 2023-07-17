import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../rtk/user";
import { useAppDispatch, useAppSelector } from "../rtk/store";
const Layout = (props: {children: React.ReactNode[] | React.ReactNode}) => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
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

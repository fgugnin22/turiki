import React, { useEffect } from "react";
import Footer from "../widgets/Footer";
import { getParameterByName } from "../helpers/getParameterByName";
import { checkAuth, googleAuthenticate } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import Header from "../widgets/Header";
export const Layout = (props: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
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
    <div className="flex min-h-screen flex-col bg-dark">
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

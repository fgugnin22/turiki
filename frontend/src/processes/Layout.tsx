import React, { useEffect } from "react";
import Footer from "../widgets/Footer";
import { getParameterByName } from "../helpers/getParameterByName";
import {
  checkAuth,
  discordAuthenticate,
  googleAuthenticate
} from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import Header from "../widgets/Header";
export const Layout = (props: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  // const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const dispatch = useAppDispatch();
  const state = getParameterByName("state");
  const code = getParameterByName("code"); //get code and state from google oauth2
  useEffect(() => {
    if (state && code) {
      dispatch(googleAuthenticate({ state, code }));
      dispatch(discordAuthenticate({ state, code }));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
      }
    }
  }, [location.href]);

  return (
    <div className="flex flex-col bg-dark">
      <div className="mx-auto w-[97%] xl:w-[1100px] grow flex flex-col justify-between text-lightgray">
        <div className="min-h-screen">
          <Header />
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

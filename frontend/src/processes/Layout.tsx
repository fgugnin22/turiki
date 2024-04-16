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
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import NotificationElem from "../features/NotificationElem";

export const Layout = (props: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const notifications = tournamentAPI.useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 10000
  });

  const dispatch = useAppDispatch();
  const state = getParameterByName("state");
  const code = getParameterByName("code");
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
        <div className="fixed bottom-4 right-4 flex flex-col-reverse gap-4 z-50 bg-dark">
          {notifications?.data?.map((n) => (
            <NotificationElem key={n.id} data={n} />
          ))}
        </div>
      </div>
    </div>
  );
};

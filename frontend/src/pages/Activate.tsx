import React, { useEffect, useState } from "react";
import { Layout } from "../processes/Layout";
import { Navigate, useParams } from "react-router-dom";
import { activate } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
const Activate = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [verified, setVerified] = useState(false);
  const params = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const uid = params.uid;
    const token = params.token;
    if (!(uid && token)) {
      return;
    } else {
      dispatch(activate({ uid, token }))
        .then(() => setVerified(true))
        .catch(() => {
          setError(true);
        });
    }
  }, []);

  if (verified || isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN.path} replace />;
  }
  return (
    <Layout>
      <div className="flex justify-center mb-auto mt-auto">
        <div className="">
          <h1 className="text-center text-lightblue text-4xl mt-24">
            {error ? "Произошла ошибка...(" : "Подождите..."}
          </h1>
        </div>
      </div>
    </Layout>
  );
};

export default Activate;

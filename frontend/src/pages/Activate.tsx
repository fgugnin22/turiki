import React, { useState } from "react";
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
    const verify_account = () => {
        const uid = params.uid;
        const token = params.token;
        if (!(uid && token)) {
            return;
        } else {
            dispatch(activate({ uid, token }));
            setVerified(true);
        }
    };
    // check if verified -> redirect to homepage
    if (verified || isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD.path} replace />;
    }
    return (
        <Layout>
            <div className="flex justify-center mb-auto mt-auto">
                <div className="">
                    <ButtonMain
                        className="py-12 px-24 focus:py-11 focus:px-[94px] active:py-11 active:px-[94px] rounded-xl text-3xl font-bold hover:scale-105 transition"
                        onClick={verify_account}
                        type="button"
                        style={{
                            marginTop: "50px"
                        }}
                    >
                        Подтвердить почту
                    </ButtonMain>
                </div>
            </div>
        </Layout>
    );
};

export default Activate;

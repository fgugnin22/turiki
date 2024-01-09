import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { Navigate, useParams } from "react-router-dom";
import { activate } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../app/RouteTypes";
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
                    <button
                        className="py-12 px-24 rounded-xl bg-green-600 text-3xl font-semibold hover:bg-green-600 hover:scale-105 transition active:animate-pulse"
                        onClick={verify_account}
                        type="button"
                        style={{
                            marginTop: "50px"
                        }}
                    >
                        Подтвердить почту
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Activate;

import React, { ReactEventHandler, useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate, useParams } from "react-router-dom";
import { activate } from "../rtk/user";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../rtk/store";
import { ROUTES } from "../RouteTypes";
const Activate = () => {
    const dispatch = useAppDispatch();

    const [verified, setVerified] = useState(false);
    const params = useParams();
    const verify_account = () => {
        const uid = params.uid;
        const token = params.token;
        if (!(uid && token)) {
            return;
        }
        dispatch(activate({ uid, token }));
        setVerified(true);
    };
    // check if verified -> redirect to homepage
    if (verified) {
        return <Navigate to={ROUTES.DASHBOARD.path} replace />;
    }
    return (
        <Layout>
            <div className="flex justify-center text-2xl mt-[5%]">
                <div className="">
                    <h1>Verify your account:</h1>
                    <button
                        className="py-12 px-24 rounded-xl bg-green-600 "
                        onClick={verify_account}
                        type="button"
                        style={{
                            marginTop: "50px"
                        }}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Activate;

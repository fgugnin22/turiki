import React, { useState } from "react";
import {Layout} from "../processes/Layout";
import { Navigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../app/RouteTypes";
const ResetPasswordConfirm = () => {
    const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
    const dispatch = useAppDispatch();
    const params = useParams<string>();
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: "",
        re_new_password: ""
    });
    const { new_password, re_new_password } = formData;
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        return setFormData({ ...formData, [target.name]: target.value });
    };
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const uid = params.uid;
        const token = params.token;
        if (!(uid && token)) {
            return;
        }
        dispatch(
            resetPasswordConfirm({ uid, token, new_password, re_new_password })
        );
        setRequestSent(true);
    };
    if (requestSent) {
        return <Navigate to={ROUTES.DASHBOARD.path} replace />;
    }
    return (
        <Layout>
            <div className="flex justify-center my-[5%]">
                <div className="w-[450px]">
                    <p className="text-center mb-1 font-semibold text-2xl">
                        Reset Password via email
                    </p>
                    <form onSubmit={submitHandler}>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="new_password"
                                placeholder="New Password"
                                name="new_password"
                                value={new_password}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="re_new_password"
                                placeholder="Confirm New Password"
                                name="re_new_password"
                                value={re_new_password}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className=""></div>
                        <button
                            className="py-2 px-2 w-full bg-green-400 hover:bg-green-500 transition duration-300 rounded"
                            type="submit"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ResetPasswordConfirm;

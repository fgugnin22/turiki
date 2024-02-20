import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { register } from "../shared/rtk/user";
import { Navigate } from "react-router-dom";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
import { ROUTES } from "../shared/RouteTypes";
import RegistrationForm from "../widgets/RegistrationForm";
const Signup = () => {
    return (
        <Layout>
            <div className="flex justify-center items-center grow py-16">
                <RegistrationForm />
            </div>
        </Layout>
    );
};

export default Signup;

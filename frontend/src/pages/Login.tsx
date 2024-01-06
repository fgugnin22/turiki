import React, { useState, useEffect } from "react";
import { Layout } from "../processes/Layout";

import LoginForm from "../widgets/LoginForm";

const Login = () => {
    return (
        <Layout>
            <div className="flex justify-center items-center grow">
                <LoginForm />
            </div>
        </Layout>
    );
};

export default Login;

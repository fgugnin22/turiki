import React, { useState, useEffect } from "react";
import { Layout } from "../processes/Layout";

import LoginForm from "../widgets/LoginForm";

const Login = () => {
  return (
    <Layout>
      <div className="flex justify-center my-[5%]">
        <div className="w-[450px]">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;

import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate, useParams } from "react-router-dom";
import { activate } from "../rtk/user";
import { useDispatch } from "react-redux";
const Activate = () => {
  const dispatch = useDispatch();

  const [verified, setVerified] = useState(false);
  const params = useParams();
  const verify_account = (e) => {
    const uid = params.uid;
    const token = params.token;
    dispatch(activate({ uid, token }));
    setVerified(true);
  };
  // check if verified -> redirect to homepage
  if (verified) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout>
      <div className="container">
        <div
          className="d-flex flex-column justify-content-center align-items-center "
          style={{ marginTop: "200px" }}
        >
          <h1>Verify your account:</h1>
          <button
            onClick={verify_account}
            type="button"
            className="btn btn-primary"
            style={{
              marginTop: "50px",
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

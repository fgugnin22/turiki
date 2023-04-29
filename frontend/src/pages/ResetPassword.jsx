import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate } from "react-router-dom";
import { resetPassword } from "../rtk/user";
import { useDispatch } from "react-redux";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(email));
    setRequestSent(true);
  };
  // check if authenticated -> redirect to homepage
  if (requestSent) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout>
      <div className="container mt-5">
        <h1>Request password reset:</h1>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group"></div>
          <button className="btn btn-primary mt-3" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;

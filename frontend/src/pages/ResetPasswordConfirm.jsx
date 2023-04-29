import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "../rtk/user";
import { useDispatch } from "react-redux";
const ResetPasswordConfirm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const uid = params.uid;
    const token = params.token;
    dispatch(
      resetPasswordConfirm({ uid, token, new_password, re_new_password })
    );
    setRequestSent(true);
  };
  if (requestSent) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout>
      <div className="container mt-5">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              className="form-control"
              type="new_password"
              placeholder="New Password"
              name="new_password"
              value={new_password}
              onChange={(e) => onChange(e)}
              minLength={6}
              required
            />
            <input
              className="form-control"
              type="re_new_password"
              placeholder="Confirm New Password"
              name="re_new_password"
              value={re_new_password}
              onChange={(e) => onChange(e)}
              minLength={6}
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

export default ResetPasswordConfirm;

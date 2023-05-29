import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "../rtk/user";
import { useAppDispatch, useAppSelector } from "../rtk/store";
const ResetPasswordConfirm = () => {
  const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
  const dispatch = useAppDispatch();
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
      <div className="flex justify-center my-[5%]">
        <div className="w-[450px]">
          <p className="text-center mb-1 font-semibold text-2xl">
            Reset Password via email
          </p>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="relative mb-3">
              <input
                className={inputClasses}
                type="new_password"
                placeholder="New Password"
                name="new_password"
                value={new_password}
                onChange={(e) => onChange(e)}
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
                onChange={(e) => onChange(e)}
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

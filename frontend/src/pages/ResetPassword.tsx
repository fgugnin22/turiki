import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Navigate } from "react-router-dom";
import { resetPassword } from "../rtk/user";
import { useAppDispatch, useAppSelector } from "../rtk/store";
const ResetPassword = () => {
  const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
  const dispatch = useAppDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;
  const onChange = (e:React.FormEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e:React.FormEvent<HTMLInputElement>) => {
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
      <div className="flex justify-center my-[5%]">
        <div className="w-[450px]">
          <p className="text-center mb-1 font-semibold text-2xl">
            Reset Password via email
          </p>
          <form onSubmit={(e:React.FormEvent<HTMLInputElement>) => onSubmit(e)}>
            <div className="relative mb-3">
              <input
                className={inputClasses}
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e:React.FormEvent<HTMLInputElement>) => onChange(e)}
                required
              />
            </div>
            <div className=""></div>
            <button
              className="py-2 px-2 w-full bg-violet-500 hover:bg-violet-600 text-gray-100 transition duration-300 rounded"
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

export default ResetPassword;

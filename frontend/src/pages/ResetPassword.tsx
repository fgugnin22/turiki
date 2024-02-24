import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { Navigate } from "react-router-dom";
import { resetPassword } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email: ""
  });
  const { email } = formData;
  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e: any) => {
    e.preventDefault();
    dispatch(resetPassword(email));
    setRequestSent(true);
  };
  // check if authenticated -> redirect to homepage
  if (requestSent) {
    return <Navigate to={ROUTES.LOGIN.path} replace />;
  }
  return (
    <Layout>
      <div className="flex justify-center my-[5%]">
        <div className="w-[450px]">
          <p className="text-center mb-1 font-semibold text-xl text-lightgray">
            Введите почту, к которой привязан аккаунт
          </p>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="relative mb-3">
              <input
                className={`block min-h-[auto] w-full rounded-[10px] border-2 border-lightgray bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-lightblue`}
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                required
              />
            </div>
            <div className=""></div>
            <ButtonMain
              className="py-3 active:py-[10px] focus:py-[10px] w-full text-gray-100 font-medium transition duration-300 rounded"
              type="submit"
            >
              Отправить письмо
            </ButtonMain>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;

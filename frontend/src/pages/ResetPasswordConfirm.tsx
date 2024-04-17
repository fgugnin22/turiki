import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { Navigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "../shared/rtk/user";
import { useAppDispatch } from "../shared/rtk/store";
import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
const ResetPasswordConfirm = () => {
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

  const [error, setError] = useState("");
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uid = params.uid;
    const token = params.token;
    if (!(uid && token)) {
      setError("Неправильная ссылка для сброса пароля");
      return;
    }

    if (new_password !== re_new_password) {
      setError("Пароли не совпадают!");
      setTimeout(() => setError(""), 2500);
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
          <p className="text-center mb-1 font-semibold text-xl text-lighgray">
            Создайте новый пароль
          </p>
          <form onSubmit={submitHandler}>
            <div className="relative mb-3">
              <input
                className={`block min-h-[auto] w-full rounded-[10px] border-2 border-lightgray bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-lightblue`}
                type="password"
                placeholder="Новый пароль"
                name="new_password"
                value={new_password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                minLength={6}
                required
              />
            </div>
            <div className="relative mb-3">
              <input
                className={`block min-h-[auto] w-full rounded-[10px] border-2 border-lightgray bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-lightblue`}
                type="password"
                placeholder="Повторите пароль"
                name="re_new_password"
                value={re_new_password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                minLength={6}
                required
              />
            </div>
            <div className=""></div>
            <ButtonMain
              className="py-3 active:py-[10px] focus:py-[10px] w-full text-gray-100 font-medium transition duration-300 rounded"
              type="submit"
            >
              {error ? error : "Сохранить пароль"}
            </ButtonMain>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordConfirm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { register } from "../shared/rtk/user";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
import { ROUTES } from "../app/RouteTypes";
const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    re_password: ""
  });
  const { email, password, name, re_password } = formData;
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    return setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === re_password) {
      dispatch(register({ name, email, password, re_password }));
      setAccountCreated(true);
    }
  };
  // check if authenticated -> redirect to homepage
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate(ROUTES.DASHBOARD.path, { replace: true });
  }
  if (accountCreated) {
    navigate(ROUTES.LOGIN.path, { replace: true });
  }
  return (
    <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
      <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
        Зарегистрироваться
      </div>
      <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
        Уже есть аккаунт?
        <Link
          className="text-sm text-blue-500 underline hover:text-blue-700"
          to={ROUTES.LOGIN.path}
        >
          Войти
        </Link>
      </span>

      <div className="p-6 mt-8">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col mb-2">
            <div className=" relative ">
              <input
                type="text"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                name="name"
                value={name}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                placeholder="Ник"
              />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className=" relative ">
              <input
                type="text"
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                name="email"
                value={email}
                id="create-account-email"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Почта"
              />
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className=" relative ">
              <input
                type="password"
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                name="password"
                value={password}
                placeholder="Пароль"
                required
              />
            </div>
            <div className=" relative ">
              <input
                type="password"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                name="re_password"
                placeholder="Пароль еще раз"
                value={re_password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="flex w-full mb-2 mt-4">
            <button
              type="submit"
              className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Создать аккаунт
            </button>
          </div>
          <div className="flex gap-4 item-center">
            <button
              type="button"
              onClick={continueWithGoogle}
              className="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
              </svg>
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

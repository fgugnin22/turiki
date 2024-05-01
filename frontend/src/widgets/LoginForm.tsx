import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { login, resetRegistered } from "../shared/rtk/user";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
import { continueWithDiscord } from "../helpers/continueWithDiscord";
import ButtonMain from "../shared/ButtonMain";
import { Angle } from "../shared/Angle";
const LoginForm = () => {
  const { loading, isAuthenticated, registered, loginFail } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (registered) dispatch(resetRegistered());
  }, [registered]);
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.path, { replace: true });
    }
  }, [isAuthenticated]);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { email, password } = formData;
  const [error, setError] = useState("");
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setError("");
    return setFormData({ ...formData, [target.name]: target.value });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      email,
      password
    };
    setFormData({ email: "", password: "" });
    const res = await dispatch(login(data));
    if (res.meta.requestStatus === "rejected") {
      setError(res.payload.detail);
    }
  };
  const navigate = useNavigate();
  return (
    <div
      className="w-full lg:w-[initial] lg:min-w-[500px] leading-10 relative after:absolute after:opacity-[0.04] after:top-0 after:bottom-0 after:left-0 after:right-0 
    mx-auto my-auto rounded-[10px] after:rounded-[10px] 
    border border-turquoise after:bg-gradient-to-b after:from-transparent 
  after:to-darkturquoise after:z-[-1] py-12 flex flex-col"
    >
      <h2
        data-content="Вход"
        className="before:text-[44px] before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center text-[44px] before:w-full  before:text-center before:font-extrabold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
      >
        Вход
      </h2>
      <div className="w-[85%] flex flex-col lg:flex-row mt-8 justify-center items-center mx-auto gap-3 lg:gap-0 font-medium">
        <ButtonMain
          type="button"
          onClick={continueWithGoogle}
          className="py-[5px] w-full lg:w-[initial] block mx-auto focus:py-[3.5px] focus:px-[18px] duration-200 after:bg-gradient-to-l active:px-[18px]"
        >
          <span className="z-40">Войти через Google</span>
        </ButtonMain>
        <ButtonMain
          type="button"
          onClick={continueWithDiscord}
          className="py-[5px] w-full lg:w-[initial] block mx-auto focus:py-[3.5px] focus:px-[18px] duration-200 after:bg-gradient-to-l active:px-[18px]"
        >
          <span className="z-40">Войти через Discord</span>
        </ButtonMain>
      </div>
      <form onSubmit={onSubmit}>
        <div
          className={
            `rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-8 w-4/5 mx-auto ` +
            (error?.length > 0 ? "after:!bg-warning after:!bg-none" : "")
          }
        >
          <input
            className={
              `absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl ` +
              (error?.length > 0 ? "placeholder:text-warning" : "")
            }
            id="sign-in-email"
            type="email"
            placeholder="Почта"
            name="email"
            value={email}
            onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
            required
          />
          <Angle color={error ? "#A7652C" : "#21DBD3"} />
        </div>
        <div
          className={
            `rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-5 w-4/5 mx-auto ` +
            (error?.length > 0 ? "after:!bg-warning after:!bg-none" : "")
          }
        >
          <input
            className={
              `absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl ` +
              (error?.length > 0 ? "placeholder:text-warning" : "")
            }
            type="password"
            placeholder="Пароль"
            name="password"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
            minLength={6}
            required
          />
          <Angle color={error ? "#A7652C" : "#21DBD3"} />
          <span className=" absolute z-50 text-sm -bottom-5 lg:-bottom-6 text-warning">
            {error ? "Неверные данные учётной записи" : ""}
          </span>
        </div>
        <Link
          data-content="Забыли пароль?"
          className="before:w-full mx-auto mt-4 font-medium w-4/5 block before:top-0 before:bottom-0 before:left-0 before:right-0 before:text-right text-right before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-lightblue before:hover:bg-none text-lg transition"
          to={ROUTES.RESET_PASSWORD.path}
        >
          Забыли пароль?
        </Link>
        <div className="flex w-full">
          {loading ? (
            <ButtonMain
              type="submit"
              className="py-[5px] w-4/5 mx-auto focus:py-[3.5px] focus:px-[unset] duration-200 mt-5 after:bg-gradient-to-l flex flex-nowrap justify-center gap-2 items-center"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
              </svg>
              <span className=" font-medium">Загрузка</span>
            </ButtonMain>
          ) : (
            <ButtonMain
              type="submit"
              className="py-[5px] w-4/5 block mx-auto focus:py-[3.5px] focus:px-[unset] duration-200 mt-5 after:bg-gradient-to-l"
            >
              <span className="z-40">Войти</span>
            </ButtonMain>
          )}
        </div>
      </form>
      <Link
        data-content="Зарегистрироваться"
        className="before:w-full mx-auto mt-6 font-medium w-4/5 block before:top-0 before:bottom-0 before:left-0 before:right-0 before:text-center text-center before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-lightblue before:hover:bg-none text-lg transition"
        to={ROUTES.REGISTER_ACCOUNT.path}
      >
        Зарегистрироваться
      </Link>
    </div>
  );
};

export default LoginForm;

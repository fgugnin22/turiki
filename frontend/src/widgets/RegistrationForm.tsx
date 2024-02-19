import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { register } from "../shared/rtk/user";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
import { Angle } from "../shared/Angle";
type FormErrors = {
  email?: string;
  password?: string;
  name?: string;
  re_password?: string;
};
const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [accountCreated, setAccountCreated] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: undefined,
    password: undefined,
    name: undefined,
    re_password: undefined
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    re_password: ""
  });
  const { email, password, name, re_password } = formData;
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormErrors((p) => ({ ...p, [target.name]: "" }));
    return setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === re_password) {
      const res = await dispatch(
        register({ name, email, password, re_password })
      );
      if (res.meta.requestStatus === "rejected") {
        setFormErrors(res.payload);
      } else {
        // setAccountCreated(true);
      }
    } else {
      setFormErrors((p) => ({
        ...p,
        password: "",
        re_password: "Пароли не совпадают"
      }));
    }
  };
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate(ROUTES.DASHBOARD.path, { replace: true });
  }
  if (accountCreated) {
    navigate(ROUTES.LOGIN.path, { replace: true });
  }
  return (
    <div
      className="min-w-[500px] leading-10 relative after:absolute after:opacity-[0.04] after:inset-0 
          mx-auto my-auto rounded-[10px] after:rounded-[10px] 
          border border-turquoise after:bg-gradient-to-b after:from-transparent 
        after:to-darkturquoise after:z-[-1] hover:!drop-shadow-[0_0_1px_#4cf2f8] !drop-shadow-[0_0_1px_#4cf2f8] py-[52px] flex flex-col"
    >
      <h2
        data-content="Зарегистрироваться"
        className="before:text-[44px] before:inset-0  w-full text-center text-[44px] before:w-full  before:text-center before:font-extrabold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
      >
        Зарегистрироваться
      </h2>
      <p className="w-full text-center font-light text-lg leading-10">
        <span className=" text-lightgray !filter-none">Уже есть аккаунт?</span>{" "}
        <Link
          data-content="Войти"
          className="before:w-full before:text-center before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-lightblue before:hover:bg-none"
          to={ROUTES.LOGIN.path}
        >
          Войти
        </Link>
      </p>

      <div>
        <form onSubmit={onSubmit}>
          <div
            className={
              `rounded-[10px] relative after:absolute before:absolute
            after:inset-0 before:inset-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px]
            after:z-0 before:z-10 z-20 before:bg-dark before:rounded-[9px]
            bg-transparent h-12 mt-7 w-4/5 mx-auto ` +
              (formErrors?.name ? "after:!bg-warning after:!bg-none" : "")
            }
          >
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
              placeholder="Ник"
              className="absolute inset-0 z-20 bg-transparent outline-none px-3 text-lightgray autofill:bg-transparent"
            />
            <Angle />
            <span className="absolute z-50 -bottom-4 text-sm text-lightblue">
              {formErrors?.name ?? ""}
            </span>
          </div>
          <div
            className={
              `rounded-[10px] relative after:absolute before:absolute
            after:inset-0 before:inset-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px]
            after:z-0 before:z-10 z-20 before:bg-dark before:rounded-[9px]
            bg-transparent h-12 mt-7 w-4/5 mx-auto ` +
              (formErrors?.email ? "after:!bg-warning after:!bg-none" : "")
            }
          >
            <input
              type="text"
              onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
              name="email"
              value={email}
              id="create-account-email"
              placeholder="Почта"
              className="absolute inset-0 z-20 bg-transparent outline-none px-3 text-lightgray"
            />
            <Angle />
            <span className="absolute z-50 -bottom-4 text-sm text-lightblue">
              {formErrors?.email ?? ""}
            </span>
          </div>
          <div className="flex justify-center gap-[15px]">
            <div
              className={
                `rounded-[10px] relative after:absolute 
                                before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-7 w-[calc(40%-7.5px)]` +
                (formErrors?.password ? "after:!bg-warning after:!bg-none" : "")
              }
            >
              <input
                className="absolute inset-0 z-20 bg-transparent outline-none px-3 text-lightgray"
                type="password"
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                name="password"
                value={password}
                placeholder="Пароль"
                required
              />
              <Angle />
              <span className="absolute z-50 -bottom-4 text-sm text-lightblue">
                {formErrors?.password ?? ""}
              </span>
            </div>
            <div
              className={
                `rounded-[10px] relative after:absolute 
                before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
                after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                mt-7 w-[calc(40%-7.5px)] ` +
                (formErrors?.re_password
                  ? "after:!bg-warning after:!bg-none"
                  : "")
              }
            >
              <input
                className="absolute inset-0 z-20 bg-transparent outline-none px-3 text-lightgray"
                type="password"
                name="re_password"
                placeholder="Пароль еще раз"
                value={re_password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                minLength={6}
                required
              />
              <Angle />
              <span className="absolute z-50 -bottom-5 text-sm text-lightblue">
                {formErrors?.re_password ?? ""}
              </span>
            </div>
          </div>
          <ButtonMain
            className="py-[5px] w-3/5 block mx-auto mt-8 focus:py-[3.5px] focus:px-[unset] duration-200"
            type="submit"
          >
            Создать аккаунт
          </ButtonMain>
          <ButtonSecondary
            type="button"
            onClick={continueWithGoogle}
            className="flex items-center justify-center w-3/5 py-[5px] mx-auto mt-8 text-center !bg-transparent"
          >
            <span
              data-content="Войти через Google"
              className="z-40 before:w-full before:text-center before:bg-gradient-to-b 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
            >
              Войти через Google
            </span>
          </ButtonSecondary>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

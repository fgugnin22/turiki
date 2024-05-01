import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { register } from "../shared/rtk/user";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
import { continueWithDiscord } from "../helpers/continueWithDiscord";
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
    return setFormData({ ...formData, [target.name]: target.value.trim() });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { name, email, password, re_password };
    setFormData({
      name: "",
      email: "",
      password: "",
      re_password: ""
    });
    if (password === re_password) {
      const res = await dispatch(register(data));
      if (res.meta.requestStatus === "rejected") {
        setFormErrors(res.payload);
      } else {
        setAccountCreated(true);
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

  return (
    <div
      className="w-full lg:w-[initial] lg:min-w-[500px] leading-10 relative after:absolute after:opacity-[0.04] after:top-0 after:bottom-0 after:left-0 after:right-0 
          mx-auto my-auto rounded-[10px] after:rounded-[10px] 
          border border-turquoise after:bg-gradient-to-b after:from-transparent 
        after:to-darkturquoise after:z-[-1] py-[52px] flex flex-col"
    >
      <h2
        data-content="Зарегистрироваться"
        className="before:lg:text-[44px] lg:h-10 neonshadow text-2xl before:text-2xl before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center lg:text-[44px] before:w-full  before:text-center before:font-extrabold before:bg-gradient-to-r 
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
            after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
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
              className={
                "absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray autofill:bg-transparent " +
                (formErrors?.name ? "placeholder:text-warning" : "")
              }
            />
            <Angle color={formErrors?.name ? "#A7652C" : "#21DBD3"} />
            <span className=" absolute z-50 text-xs -bottom-5 text-warning">
              {formErrors?.name ?? ""}
            </span>
          </div>
          <div
            className={
              `rounded-[10px] relative after:absolute before:absolute
            after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
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
              className={
                "absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray " +
                (formErrors?.email ? "placeholder:text-warning" : "")
              }
            />
            <Angle color={formErrors?.email ? "#A7652C" : "#21DBD3"} />
            <span className=" absolute z-50 text-xs -bottom-5 text-warning">
              {formErrors?.email ?? ""}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-[15px] w-4/5 mx-auto relative">
            <div
              className={
                `rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-7 w-full` +
                (formErrors?.password ? "after:!bg-warning after:!bg-none" : "")
              }
            >
              <input
                className={
                  "absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray " +
                  (formErrors?.password ? "placeholder:text-warning" : "")
                }
                type="password"
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                name="password"
                value={password}
                placeholder="Пароль"
                required
              />
              <Angle color={formErrors?.password ? "#A7652C" : "#21DBD3"} />
              <span className=" absolute z-50 text-xs -bottom-5 text-warning">
                {formErrors?.password ?? ""}
              </span>
            </div>
            <div
              className={
                `rounded-[10px] relative after:absolute 
                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                mt-7 w-full ` +
                (formErrors?.re_password
                  ? "after:!bg-warning after:!bg-none"
                  : "")
              }
            >
              <input
                className={
                  "absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray " +
                  (formErrors?.re_password ? "placeholder:text-warning" : "")
                }
                type="password"
                name="re_password"
                placeholder="Пароль еще раз"
                value={re_password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                minLength={6}
                required
              />
              <Angle color={formErrors?.re_password ? "#A7652C" : "#21DBD3"} />
              <span className=" absolute z-50 text-xs -bottom-5 text-warning">
                {formErrors?.re_password ?? ""}
              </span>
            </div>
            {accountCreated && (
              <span className="absolute -bottom-[25px] lg:-bottom-5 lg:text-xs z-50 leading-3 text-center w-full text-[10px]">
                Чтобы войти, нужно перейти по ссылке, отправленной на вашу
                почту!
              </span>
            )}
          </div>
          <ButtonMain
            className="py-[5px] w-4/5 block mx-auto mt-8 focus:py-[3.5px] focus:px-[unset] duration-200"
            type="submit"
          >
            Создать аккаунт
          </ButtonMain>
          <div className="flex mt-8 w-4/5 justify-center items-center mx-auto gap-4 flex-col lg:flex-row ">
            <ButtonSecondary
              type="button"
              onClick={continueWithGoogle}
              className="flex w-full lg:w-[initial] font-semibold items-center grow justify-center py-[5px] mx-auto text-center !bg-transparent !drop-shadow-[0_0_1px_#4cf2f8]"
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
            <ButtonSecondary
              type="button"
              onClick={continueWithDiscord}
              className="flex w-full lg:w-[initial] font-semibold items-center grow justify-center py-[5px] mx-auto text-center !bg-transparent !drop-shadow-[0_0_1px_#4cf2f8]"
            >
              <span
                data-content="Войти через Discord"
                className="z-40 before:w-full before:text-center before:bg-gradient-to-b 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
              >
                Войти через Discord
              </span>
            </ButtonSecondary>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

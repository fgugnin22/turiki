import React, { useEffect, useState } from "react";
import {
  getUser,
  login,
  modifyUserCredentials,
  uploadUserImage
} from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
import { getImagePath } from "../helpers/getImagePath";
const serverURL = import.meta.env.VITE_API_URL;

const UserChangeForm = ({ name }: { name: string }) => {
  const [nameOpened, setNameOpened] = useState(false);
  const [newPasswordOpened, setNewPasswordOpened] = useState(false);
  const [oldPasswordOpened, setOldPasswordOpened] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    newPassword: "",
    gameName: ""
  });
  let { userDetails: user, loading } = useAppSelector((state) => state.user);
  const { email, password, userName, newPassword, gameName } = formData;
  const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setError("");
    return setFormData({ ...formData, [target.name]: target.value.trim() });
  };
  const onSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (!user?.name || user?.google_oauth2) {
      const body = {
        name: userName === "" ? user?.name : userName,
        email: email === "" ? user?.email : email,
        game_name: gameName === "" ? user?.game_name : gameName,
        new_password: newPassword
      };
      setFormData({
        email: "",
        password: "",
        userName: "",
        newPassword: "",
        gameName: ""
      });
      await dispatch(modifyUserCredentials(body));
      dispatch(getUser(access!));

      return;
    }
    if (!newPassword) {
      const body = {
        name: userName === "" ? user?.name : userName,
        email: email === "" ? user?.email : email,
        game_name: gameName === "" ? user?.game_name : gameName
      };
      setFormData({
        email: "",
        password: "",
        userName: "",
        newPassword: "",
        gameName: ""
      });
      await dispatch(modifyUserCredentials(body));
      dispatch(getUser(access!));

      return;
    }
    const res = await dispatch(
      login({ email: user?.email!, password, keepTokens: false })
    );
    if (res.meta.requestStatus === "rejected") {
      setError(res.payload.detail);
    }
    if (localStorage.getItem("access")) {
      const body = {
        name: userName === "" ? user?.name : userName,
        email: email === "" ? user?.email : email,
        game_name: gameName === "" ? user?.game_name : gameName,
        old_password: password,
        new_password: newPassword
      };
      setFormData({
        email: "",
        password: "",
        userName: "",
        newPassword: "",
        gameName: ""
      });
      dispatch(modifyUserCredentials(body));
    }
    localStorage.setItem("access", access!);
    localStorage.setItem("refresh", refresh!);
    dispatch(getUser(access!));
  };
  const onImageSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    if (!target.files) {
      return;
    }
    const formData = new FormData();
    formData.append("image", target.files[0]);
    await dispatch(uploadUserImage(formData));
    window.location.reload();
  };
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === "Escape") {
        if (oldPasswordOpened) {
          setOldPasswordOpened(false);
        } else if (newPasswordOpened) {
          setNewPasswordOpened(false);
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <section
      className="w-full sm:w-4/5 lg:w-3/5 relative after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 
      hover:after:!drop-shadow-[0_0_2px_#4cf2f8] after:!drop-shadow-[0_0_2px_#4cf2f8] mx-auto my-auto mb-24 rounded-[10px] after:rounded-[10px] 
    after:border after:border-turquoise after:bg-gradient-to-b after:from-transparent 
  after:to-darkturquoise after:from-[-30%] after:to-[3000%]"
    >
      <form
        className="relative z-30 px-4 py-8 lg:px-14 lg:py-10"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col lg:flex-row gap-0 sm:gap-10 justify-between items-center lg:justify-start">
          <label
            style={{
              gridTemplateAreas: "a"
            }}
            className="grid w-36 h-36"
            htmlFor="file_input"
          >
            {user?.image && (
              <img
                style={{ gridArea: "a" }}
                alt="profil"
                src={serverURL + "/" + getImagePath(user.image)}
                className="object-cover object-center rounded-full ml-[3%] mt-[3%] h-[94%] w-[94%] opacity-80 relative z-10 aspect-square	"
              />
            )}
            <img
              style={{ gridArea: "a" }}
              src={serverURL + "/media/img/uploadround.svg"}
              className={
                "object-cover object-center rounded-full h-full w-full opacity-100 relative z-30 transition aspect-square	" +
                (user?.image ? "!opacity-0 hover:!opacity-100" : "")
              }
              alt=""
            />
          </label>
          <input
            onChange={onImageSubmit}
            id="file_input"
            type="file"
            accept="image/png"
            hidden
          />
          <div className="mb-8 lg:grow flex flex-col-reverse lg:block">
            <button
              type="button"
              onClick={() => setNameOpened((p) => !p)}
              className="font-semibold text-lg hover:text-lightblue transition"
              id="file_input_help"
            >
              {nameOpened ? (
                <span
                  data-content="Редактировать профиль"
                  className="z-40 text-sm lg:text-base before:w-full before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
                >
                  Редактировать профиль
                </span>
              ) : (
                "Редактировать профиль"
              )}
            </button>
            {nameOpened ? (
              <div
                className="rounded-[10px] relative after:absolute 
                            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                            before:z-10 z-20 before:bg-dark before:rounded-[8px] 
                            before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%] bg-transparent h-12
                            my-4 lg:my-0 w-full mx-auto"
              >
                <input
                  type="text"
                  placeholder={`${user?.name}`}
                  name="userName"
                  value={userName}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                  required={!user?.name}
                  minLength={3}
                  className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl"
                />
              </div>
            ) : (
              <p
                data-content={name}
                className="text-center before:text-center before:text-[28px] mt-[9px] before:font-semibold before:top-0 before:bottom-0 before:left-0 before:right-0 
                            w-full text-[28px] before:w-full font-medium  lg:text-left lg:before:text-left before:bg-gradient-to-b
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
              >
                {name}
              </p>
            )}
          </div>
        </div>
        <div className="">
          <label
            data-content="Почта"
            className="before:text-xl before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                            w-full text-left text-xl before:w-full font-medium  before:text-left before:bg-gradient-to-b
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
            htmlFor="emailinput"
          >
            Почта
          </label>
          <div
            className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-1 w-full mx-auto mb-4"
          >
            <input
              id="emailinput"
              type="email"
              placeholder={`${user?.email}`}
              name="email"
              value={email}
              onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
              className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl"
            />
          </div>
          <label
            data-content="Ник в R6S"
            className="before:text-xl before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                            w-full text-xl before:w-full font-medium before:bg-gradient-to-b
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
            htmlFor="gamenameinput"
          >
            Ник в R6S
          </label>
          <div
            className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-1 w-full mx-auto"
          >
            <input
              id="gamenameinput"
              type="text"
              placeholder={`${user?.game_name ?? "игровой никнейм"}`}
              name="gameName"
              value={gameName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
              minLength={3}
              className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl"
            />
            <span className=" absolute z-50 -bottom-7 text-warning font-medium">
              {error?.length > 0 ? "Неправильный пароль" : ""}
            </span>
          </div>
          {!nameOpened && !newPasswordOpened ? (
            <div className="flex flex-col lg:flex-row justify-between w-full gap-4 mt-8 lg:mt-[60px]">
              <ButtonMain
                type="submit"
                className="font-semibold text-lg py-3  px-9 focus:py-[10px] w-full"
              >
                Сохранить
              </ButtonMain>
              <ButtonMain
                onClick={() => setNewPasswordOpened(true)}
                type="button"
                className="font-semibold text-lg py-3  px-9 focus:py-[10px] active:py-[10px] w-full"
              >
                Изменить пароль
              </ButtonMain>
            </div>
          ) : nameOpened ? (
            <div className="flex flex-col lg:flex-row justify-between w-full gap-4 mt-8 lg:mt-[60px]">
              <ButtonMain
                type="submit"
                className="font-semibold text-lg py-3  px-9 focus:py-[10px] w-full"
              >
                Сохранить
              </ButtonMain>
              <ButtonSecondary
                type="reset"
                onClick={() => {
                  setNameOpened(false);
                  setNewPasswordOpened(false);
                }}
                className="font-semibold text-lg py-3  px-9 focus:py-[10px] w-full"
              >
                <span
                  data-content="Отмена"
                  className="z-40 before:w-full before:text-center before:bg-gradient-to-b 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
                >
                  Отмена
                </span>
              </ButtonSecondary>
            </div>
          ) : !oldPasswordOpened ? (
            <>
              <label
                data-content="Новый пароль"
                className="before:text-xl block mt-4 before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                            w-full text-left text-xl before:w-full font-medium  before:text-left before:bg-gradient-to-b
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                htmlFor="emailinput"
              >
                Новый пароль
              </label>
              <div
                className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-1 w-full mx-auto mb-4"
              >
                <svg
                  id="imrarded"
                  onClick={() => setOldPasswordOpened(true)}
                  className="absolute z-30 h-full right-0 fill-turquoise transition hover:fill-lightblue"
                  viewBox="0 0 57 44"
                >
                  <path
                    d="M0 0H47C52.5228 0 57 4.47715 57 10V34C57 39.5228 52.5228 44 47 44H0V0Z"
                    // fill="#21DBD3"
                  />
                  <path
                    d="M26.6498 28.9912L22 24.4448M22 24.4448L26.6498 19.8983M22 24.4448H32.7C34.9091 24.4448 36.7 22.6539 36.7 20.4448V15.6445"
                    stroke="#D5E6EF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  id="user-info-new-password"
                  type="password"
                  placeholder="Новый пароль"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                  className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <label
                data-content="Подтвердите текущий пароль"
                className="before:text-xl block mt-4 before:font-medium before:top-0 before:bottom-0 before:left-0 before:right-0 
                            w-full text-left text-xl before:w-full font-medium  before:text-left before:bg-gradient-to-b
              before:from-turquoise before:bg-clip-text before:to-lightblue before:to-[80%] text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                htmlFor="emailinput"
              >
                Подтвердите текущий пароль
              </label>
              <div
                className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               mt-1 w-full mx-auto mb-4"
              >
                <button
                  type="submit"
                  onClick={(e) => {
                    setOldPasswordOpened(false);
                    setNewPasswordOpened(false);
                    onSubmit(e);
                  }}
                  className="absolute z-50 block w-[62px] h-full right-0"
                >
                  <svg
                    className="absolute z-30 h-full right-0 top-0 fill-turquoise transition hover:fill-lightblue"
                    viewBox="0 0 57 44"
                  >
                    <path d="M0 0H47C52.5228 0 57 4.47715 57 10V34C57 39.5228 52.5228 44 47 44H0V0Z" />
                    <path
                      d="M26.6498 28.9912L22 24.4448M22 24.4448L26.6498 19.8983M22 24.4448H32.7C34.9091 24.4448 36.7 22.6539 36.7 20.4448V15.6445"
                      stroke="#D5E6EF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  id="user-info-old-password"
                  type="password"
                  placeholder="Текущий пароль"
                  name="password"
                  value={password}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                  required={!!user?.name}
                  className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 text-lightgray text-2xl"
                />
              </div>
            </>
          )}
        </div>
      </form>
    </section>
  );
};

export default UserChangeForm;

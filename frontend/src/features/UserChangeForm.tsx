import React, { useState } from "react";
import { getUser, login, modifyUserCredentials } from "../shared/rtk/user";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
const UserChangeForm = ({
  name,
  imgURL
}: {
  name: string;
  imgURL?: string;
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    newPassword: "",
    gameName: ""
  });
  const dispatch = useAppDispatch();
  let { userDetails: user, loading } = useAppSelector((state) => state.user);
  const { email, password, userName, newPassword, gameName } = formData;
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    return setFormData({ ...formData, [target.name]: target.value });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    await dispatch(login({ email: user?.email!, password, keepTokens: false }));
    if (localStorage.getItem("access")) {
      const body = {
        name: userName === "" ? undefined : userName,
        email: email === "" ? undefined : email,
        game_name: gameName === "" ? undefined : gameName,
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
  return (
    <section className="h-screen mt-[5%]">
      <form
        onSubmit={onSubmit}
        className="container max-w-2xl mx-auto shadow-md md:w-3/4"
      >
        <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            {/* <div className="inline-flex items-center space-x-4">
              <a href="#" className="relative block">
                <img
                  alt="profil"
                  src="./static/bg.jpg"
                  className="mx-auto object-cover rounded-full h-16 w-16 "
                />
              </a>
              <h1 className="text-gray-600">{name}</h1>
            </div> */}
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-700 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Почта</h2>
            <div className="max-w-sm mx-auto md:w-2/3">
              {/* <button
                className="py-2 w-full px-3 bg-black hover:bg-gray-800  text-white rounded transition duration-300 flex justify-center"
                type="submit"
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Изменить данные профиля"
                )}
              </button> */}
              <div className=" relative ">
                <input
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  type="email"
                  placeholder={`${user?.email}`}
                  name="email"
                  value={email}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-4 space-y-4 text-gray-700 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Никнейм</h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <input
                    type="text"
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder={`${user?.name}`}
                    name="userName"
                    value={userName}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      onChange(e)
                    }
                    minLength={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-4 space-y-4 text-gray-700 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">
              Ник в R6S (обязателен для участия в турнирах)
            </h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <input
                    type="text"
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder={`${user?.game_name ?? "игровой никнейм"}`}
                    name="gameName"
                    value={gameName}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      onChange(e)
                    }
                    minLength={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div className="items-center w-full p-4 space-y-4 text-gray-700 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-4/12">Введите пароль</h2>
            <span>
              <input
                id="user-info-new-password"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="password"
                placeholder="Новый пароль"
                name="newPassword"
                value={newPassword}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
              />

              <input
                className="mt-6 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                id="user-info-old-password"
                type="password"
                placeholder="Текущий пароль"
                name="password"
                value={password}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                required
              />
            </span>
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-700 md:w-1/3">
            <button
              type="submit"
              className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Сохранить
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UserChangeForm;

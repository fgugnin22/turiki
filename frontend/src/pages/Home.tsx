import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../rtk/store";
import { Layout } from "../processes/Layout";
import { Link } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
import { getUser, login, logout, modifyUserCredentials } from "../rtk/user";
const Home = () => {
    const {
        userDetails: user,
        loading,
        loginFail,
        isAuthenticated
    } = useAppSelector((state) => state.user);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: ""
    });
    const { email, password, userName } = formData;
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        return setFormData({ ...formData, [target.name]: target.value });
    };
    const dispatch = useAppDispatch();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const access = localStorage.getItem("access");
        const refresh = localStorage.getItem("refresh");
        await dispatch(
            login({ email: user?.email, password, keepTokens: false })
        );
        if (localStorage.getItem("access")) {
            const body = {
                name: userName === "" ? undefined : userName,
                email: email === "" ? undefined : email,
                password
            };
            setFormData({ email: "", password: "", userName: "" });
            dispatch(modifyUserCredentials(body));
        }
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        dispatch(getUser(access));
    };
    let inputBorderColor = loginFail
        ? "border-red-600"
        : "border-slate-300 focus:border-blue-400";
    return (
        <Layout>
            <div className="">
                <div className="">
                    <div className="">
                        {user ? (
                            <>
                                <p className="mx-auto p-4 bg-slate-300 text-center">
                                    {user.email}
                                </p>
                                <div>
                                    <form onSubmit={onSubmit}>
                                        <div className="relative mb-3 mt-3">
                                            <input
                                                className={`peer block min-h-[auto] w-full rounded border-2 border-slate-300 focus:border-blue-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear`}
                                                type="email"
                                                placeholder="Email"
                                                name="email"
                                                value={email}
                                                onChange={(
                                                    e: React.FormEvent<HTMLInputElement>
                                                ) => onChange(e)}
                                            />
                                        </div>
                                        <div className="relative mb-3">
                                            <input
                                                className={`peer block min-h-[auto] w-full rounded border-2 border-slate-300 focus:border-blue-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear dark:text-neutral-200`}
                                                type="text"
                                                placeholder="Nickname"
                                                name="userName"
                                                value={userName}
                                                onChange={(
                                                    e: React.FormEvent<HTMLInputElement>
                                                ) => onChange(e)}
                                                minLength={3}
                                            />
                                        </div>
                                        <div className="relative mb-3">
                                            <input
                                                className={`peer block min-h-[auto] w-full rounded border-2 ${inputBorderColor} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear dark:text-neutral-200`}
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                value={password}
                                                onChange={(
                                                    e: React.FormEvent<HTMLInputElement>
                                                ) => onChange(e)}
                                                // required
                                            />
                                        </div>
                                        {loginFail && (
                                            <p>Вы ввели неправильный пароль</p>
                                        )}
                                        <button
                                            className="py-2 w-full px-3 bg-lime-600 hover:bg-lime-500  text-gray-900 hover:text-gray-800 rounded transition duration-300 flex justify-center"
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
                                                    <span className="sr-only">
                                                        Loading...
                                                    </span>
                                                </div>
                                            ) : (
                                                "Изменить данные профиля"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <Link to={ROUTES.LOGIN.path}>
                                <button
                                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
                                    type="button"
                                >
                                    Войти
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;

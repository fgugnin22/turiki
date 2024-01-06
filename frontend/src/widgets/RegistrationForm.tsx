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
        <div>
            <div>Зарегистрироваться</div>
            <span>
                Уже есть аккаунт?
                <Link to={ROUTES.LOGIN.path}>Войти</Link>
            </span>

            <div>
                <form onSubmit={onSubmit}>
                    <div>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                placeholder="Ник"
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <input
                                type="text"
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                name="email"
                                value={email}
                                id="create-account-email"
                                placeholder="Почта"
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <input
                                type="password"
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                name="password"
                                value={password}
                                placeholder="Пароль"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="re_password"
                                placeholder="Пароль еще раз"
                                value={re_password}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit">Создать аккаунт</button>
                    </div>
                    <div>
                        <button type="button" onClick={continueWithGoogle}>
                            <svg
                                width="20"
                                height="20"
                                fill="currentColor"
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

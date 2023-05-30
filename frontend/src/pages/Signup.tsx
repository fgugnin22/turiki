import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import { register } from "../rtk/user";
import { Navigate } from "react-router-dom";
import { continueWithGoogle } from "../helpers/continueWithGoogle";
const Signup = () => {
    const dispatch = useAppDispatch();
    const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        re_password: ""
    });
    const { email, password, name, re_password } = formData;
    const onChange = (e: React.FormEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (password === re_password) {
            dispatch(register({ name, email, password, re_password }));
            setAccountCreated(true);
        }
    };
    // check if authenticated -> redirect to homepage
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    if (accountCreated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Layout>
            <div className="flex justify-center my-[5%]">
                <div className="w-[450px]">
                    <p className="text-center mb-1 font-semibold text-2xl">
                        Sign Up
                    </p>
                    <form
                        onSubmit={(e: React.FormEvent<HTMLInputElement>) =>
                            onSubmit(e)
                        }
                    >
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={name}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                required
                            />
                        </div>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="password"
                                placeholder="Password*"
                                name="password"
                                value={password}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="password"
                                placeholder="Confirm password*"
                                name="re_password"
                                value={re_password}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
                                minLength={6}
                                required
                            />
                        </div>
                        <button
                            className="py-2 w-full px-3 bg-lime-500 hover:bg-lime-400  text-yellow-900 hover:text-yellow-800 rounded transition duration-300 flex justify-center"
                            type="submit"
                        >
                            Register
                        </button>
                    </form>
                    <button
                        className="my-2 py-2 px-2 w-full bg-red-500 hover:bg-red-600 transition duration-300 rounded"
                        onClick={continueWithGoogle}
                    >
                        Sign In With Google
                    </button>
                    <button className="w-full my-0 py-2 px-4 rounded bg-yellow-400 hover:bg-yellow-300 transition duration-300">
                        <Link className="w-full block" to="/login">
                            Already have an account? Sign In
                        </Link>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Signup;

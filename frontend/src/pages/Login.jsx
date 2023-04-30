import React, { useState, useEffect } from "react";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { login } from "../actions/auth";
import { login, resetRegistered } from "../rtk/user";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();

  const { loading, isAuthenticated, registered } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (registered) dispatch(resetRegistered());
  }, [registered]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  const continueWithGoogle = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_uri=${
          import.meta.env.VITE_API_URL
        }`
      );
      console.log(res.data.authorization_url);
      window.location.replace(res.data.authorization_url);
    } catch (err) {
      console.log("Google Auth error");
    }
  };
  // check if authenticated -> redirect to homepage

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout>
      <div className="">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="relative mb-3">
            <input
              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="relative mb-3">
            <input
              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              minLength={6}
              required
            />
          </div>
          <button className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300" type="submit">
            Login
          </button>
        </form>
        <button className="" onClick={continueWithGoogle}>
          Continue With Google
        </button>
        <p className="">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="">
          Forgot you password? <Link to="/reset-password">Reset Password</Link>
        </p>
      </div>
    </Layout>
  );
};
// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
// });
export default Login;

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
        <h1>Sign In</h1>
        <p>Sign into your Account</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="">
            <input
              className=""
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              minLength={6}
              required
            />
          </div>
          <button className="" type="submit">
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

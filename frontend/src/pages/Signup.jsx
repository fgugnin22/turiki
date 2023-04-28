import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { signup } from "../actions/auth";
import { register } from "../rtk/user";
import { Navigate } from "react-router-dom";
import {continueWithGoogle} from "../helpers/continueWithGoogle";

const Signup = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user);
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    re_password: "",
  });
  const { email, password, name, re_password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === re_password) {
      dispatch(register({name, email, password, re_password}));
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
      <div className="container mt-5">
        <h1>Sign Up</h1>
        <p>crreate dese nuts fr</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              placeholder="Email*"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              placeholder="Password*"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              minLength={6}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              placeholder="Confirm password*"
              name="re_password"
              value={re_password}
              onChange={(e) => onChange(e)}
              minLength={6}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </form>
        <button className="btn btn-danger mt-3" onClick={continueWithGoogle}>
          Sign In With Google
        </button>
        <p className="mt-3">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </Layout>
  );
};

export default Signup;

import React, { useState, useEffect } from "react";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, resetRegistered } from "../rtk/user";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();

  const { loading, isAuthenticated, registered, loginFail } = useSelector(
    (state) => state.user
  );
  let inputBorderColor = loginFail ? "border-red-600" : "border-slate-300 focus:border-blue-400";
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
      <div className="flex justify-center my-[5%]">
        <div className="w-[450px]">
        <p className="text-center mb-1 font-semibold text-2xl">Sign In</p>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="relative mb-3">
              <input
                className={`peer block min-h-[auto] w-full rounded border-2 ${inputBorderColor} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear`}
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
                className={`peer block min-h-[auto] w-full rounded border-2 ${inputBorderColor} bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear dark:text-neutral-200`}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                minLength={6}
                required
              />
            </div>
            <button
              className="py-2 w-full px-3 bg-lime-600 hover:bg-lime-500  text-yellow-900 hover:text-yellow-800 rounded transition duration-300 flex justify-center"
              type="submit"
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <button
            className="my-2 py-2 px-2 w-full bg-red-500 hover:bg-red-600 transition duration-300 rounded"
            //{loginWithGoogleClasses}
            onClick={continueWithGoogle}
          >
            Continue With Google
          </button>
          <button className="w-[49%] my-1 py-2 px-4 rounded bg-yellow-400 hover:bg-yellow-300 transition duration-300">
            <Link className="w-full block" to="/signup">
              Don't have an account? Sign Up
            </Link>
          </button>
          <button className="w-[49%] ml-[2%] my-1 py-2 px-4 rounded bg-fuchsia-500 hover:bg-fuchsia-600 transition duration-300">
            <Link className="w-full block" to="/reset-password">
              Forgot your password? Reset Password
            </Link>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

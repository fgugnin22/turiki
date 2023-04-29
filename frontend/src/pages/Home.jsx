import React from "react";
import { useSelector } from "react-redux";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <Layout>
      <div className="container">
        <div className="p-5 mb-4 bg-success bg-gradient rounded-3 mt-5">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Auth system</h1>
            <p className="col-md-8 fs-4">
              I will probably replace bootstrap jumbotron here with native
              css(probably!!...)
            </p>

            <Link to="/login">
              {user !== null ? (
                user.email
              ) : (
                <button className="btn btn-primary btn-lg" type="button">
                  Login
                </button>
              )}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

import React from "react";
import { useSelector } from "react-redux";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <Layout>
      <div className="">
        <div className="">
          <div className="">
            <h1 className="">Auth system</h1>
            <p className="">
              I will probably replace bootstrap jumbotron here with native
              css(probably!!...)
            </p>

            <Link to="/login">
              {user !== null ? (
                user.email
              ) : (
                <button className="" type="button">
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

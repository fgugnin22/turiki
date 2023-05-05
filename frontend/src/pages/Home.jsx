import React from "react";
import { useSelector } from "react-redux";
import Layout from "../hocs/Layout";
import { Link } from "react-router-dom";
import {tournamentAPI} from "../rtk/tournamenAPI"
const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const {data,error, loading} = tournamentAPI.useGetMatchByIdQuery({id: '1'})
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
            <button className="p-6 bg-green-600" onClick={() => console.log(data)}>SHOW DESE NUTS</button>
            <Link to="/login">
              {user !== null ? (
                user.email
              ) : (
                <button
                  className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
                  type="button"
                >
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

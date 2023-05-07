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
                            I will probably replace bootstrap jumbotron here
                            with native css(probably!!...)
                        </p>
                        {user ? (
                            <p className="mx-auto p-4 bg-slate-300 text-center">
                                {user.email}
                            </p>
                        ) : (
                            <Link to="/login">
                                <button
                                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
                                    type="button"
                                >
                                    Login
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

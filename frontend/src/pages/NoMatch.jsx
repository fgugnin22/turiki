import React from "react";
import Layout from "../hocs/Layout";
const NoMatch = () => {
    return (
        <Layout>
            <div className="w-full h-[70vh] bg-red-500 text-3xl py-[15%] flex items-center justify-center">
                <span className="">
                    Ох и зря я туда полез....
                    <p className="py-1" />
                    Нет такой страницы блин.
                </span>
            </div>
        </Layout>
    );
};
export default NoMatch;

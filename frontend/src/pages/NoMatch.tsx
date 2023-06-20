import React from "react";
import Layout from "../hocs/Layout";
const NoMatch = () => {
    return (
        <Layout>
            <div className="flex align-center justify-center">
            <button className="p-12 text-3xl bg-teal-600 rounded block w-48 italic font-bold hover:bg-teal-700 active:bg-red-600 ">
                Кнопка билн
            </button>
            </div>
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

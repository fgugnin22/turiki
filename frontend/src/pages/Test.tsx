import React, { useEffect } from "react";
import Layout from "../hocs/Layout";
import { authAPI } from "../rtk/auth";
const Test = () => {
    // const result = authAPI.useGetUserQuery({
    //     access: localStorage.getItem("access"),
    // });
    // const [register] = authAPI.useRegisterUserMutation();
    // const [checkAccess, { isLoading, isError, isSuccess }] =
    //     authAPI.useCheckAccessMutation();
    // const [login, {isSuccess}] = authAPI.useLoginMutation()
    const [checkAccess] = authAPI.useCheckAccessMutation()
    useEffect(() => {
        console.log(checkAccess({access: localStorage.getItem('access')}))
        // console.log(login({
        //     email: prompt('email'),
        //     password: prompt('password')
        // }))
        // console.log(
            // register({
            //     email: prompt("email"),
            //     name: prompt("name"),
            //     password: prompt("password"),
            //     re_password: prompt("re_password"),
            // })
        // );
        // console.log(checkAccess({ access: localStorage.getItem("access") }));

    }, []);

    return <Layout></Layout>;
};

export default Test;

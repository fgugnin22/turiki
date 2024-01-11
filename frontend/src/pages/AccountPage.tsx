import React from "react";
import UserChangeForm from "../features/UserChangeForm";
import { useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";

const AccountPage = () => {
    const { userDetails: user } = useAppSelector((state) => state.user);

    return <Layout>{user ? <UserChangeForm name={user.name} /> : null}</Layout>;
};

export default AccountPage;

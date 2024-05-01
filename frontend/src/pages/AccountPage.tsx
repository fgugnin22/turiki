import UserChangeForm from "../features/UserChangeForm";
import { useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";

const AccountPage = () => {
  const {
    userDetails: user,
    loading,
    loginFail
  } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  if (!loading && !user && loginFail) {
    navigate(ROUTES.LANDING.path);
  }
  return <Layout>{user ? <UserChangeForm name={user.name} /> : null}</Layout>;
};

export default AccountPage;

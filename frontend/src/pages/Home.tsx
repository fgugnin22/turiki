import { useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { ROUTES } from "../app/RouteTypes";
import UserChangeForm from "../features/UserChangeForm";
import { useState } from "react";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
const Home = () => {
  const [clicked, setClicked] = useState(false);
  let { userDetails: user } = useAppSelector((state) => state.user);
  const handleRedirect = (e: React.MouseEvent) => {
    setClicked(true);
    const target = e.target as HTMLButtonElement
    target.focus()
    setTimeout(() => {
      window.location.replace(ROUTES.REGISTER_ACCOUNT.path);
    }, 700);
  };
  return (
    <Layout>
      <div className="h-full mt-auto">
        {user ? (
          <>
            <UserChangeForm name={user.name} />
          </>
        ) : (
          <section className="">
            <h1 className="text-6xl text-center font-normal">
              Участвуйте в нашем первом турнире!
            </h1>
            <p className="w-full block text-center mt-12">
              <ButtonMain text="Зарегистрироваться и участвовать!" onClick={handleRedirect} />
            </p>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Home;

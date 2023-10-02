import { useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { ROUTES } from "../app/RouteTypes";
import UserChangeForm from "../features/UserChangeForm";
import { useState } from "react";
const Home = () => {
  const [clicked, setClicked] = useState(false);
  let { userDetails: user } = useAppSelector((state) => state.user);
  const handleRedirect = () => {
    setClicked(true);
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
              Учавствуйте в нашем первом турнире!
            </h1>
            <p className="w-full block text-center mt-12">
              <button
                onClick={handleRedirect}
                type="button"
                className={`py-4  px-6 w-96 lg:w-[500px] ${
                  clicked ? "animate-pulse" : ""
                }  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-lg lg:text-xl font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg `}
              >
                Зарегистрироваться и учавствовать!
              </button>
            </p>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Home;

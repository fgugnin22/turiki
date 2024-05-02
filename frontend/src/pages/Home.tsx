import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
import Header from "../widgets/Header";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { getParameterByName } from "../helpers/getParameterByName";
import { useEffect } from "react";
import {
  checkAuth,
  discordAuthenticate,
  googleAuthenticate
} from "../shared/rtk/user";

const server_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const dispatch = useAppDispatch();
  const state = getParameterByName("state");
  const code = getParameterByName("code"); //get code and state from google oauth2
  useEffect(() => {
    if (state && code) {
      dispatch(googleAuthenticate({ state, code }));
      dispatch(discordAuthenticate({ state, code }));
    } else {
      const access = localStorage.getItem("access");
      if (access) {
        dispatch(checkAuth(access));
      }
    }
  }, [location, isAuthenticated]);

  const handleRedirect = (e: React.MouseEvent) => {
    // setClicked(true);
    const target = e.target as HTMLButtonElement;
    target.focus();
    setTimeout(() => {
      window.location.replace(ROUTES.REGISTER_ACCOUNT.path);
    }, 700);
  };
  return (
    <div className="flex min-h-screen flex-col bg-dark">
      <div
        style={{
          backgroundImage: `url(${server_URL}/media/img/landingbg.webp)`
        }}
        className="absolute top-0 bottom-0 left-0 right-0 z-0 opacity-40 bg-center bg-cover bg-no-repeat transition"
      ></div>
      <div className="mx-auto w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between">
        <Header />
      </div>
      <section className="h-full grow my-auto relative z-10 text-lightgray font-medium">
        <img
          className="absolute bottom-0 right-0 aspect-[11/6] w-[45vw]"
          src={`${server_URL}/media/img/bigtriangle.png`}
          alt=""
        />
        <div className="mx-auto relative z-10 pt-48 w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col justify-between">
          <h1 className="text-2xl lg:text-7xl text-center font-normal max-w-[700px] lg:text-left">
            <p>Участвуйте в нашем</p>
            <p
              data-content="первом турнире!"
              className="before:lg:text-7xl -top-2 before:top-2 hover:!drop-shadow-[0_0_2px_#4cf2f8] !drop-shadow-[0_0_2px_#4cf2f8] 
                            leading-[40px] lg:leading-[90px] before:bottom-0 before:left-0 before:right-0  w-full lg:text-left lg:text-7xl before:w-full font-medium  before:lg:text-left text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
            >
              первом турнире!
            </p>
          </h1>
          {!isAuthenticated && (
            <ButtonMain
              className="mx-4 mt-2 lg:mt-0 lg:mx-0 lg:py-5 lg:px-36 lg:hover:py-5 lg:hover:px-36 lg:active:px-[142px] lg:focus:py-[18px] lg:active:py-[18px] lg:focus:px-[142px] lg:mr-auto"
              onClick={handleRedirect}
            >
              Зарегистрироваться
            </ButtonMain>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

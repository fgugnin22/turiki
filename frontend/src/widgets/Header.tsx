import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import { logout } from "../shared/rtk/user";

const serverURL = import.meta.env.VITE_API_URL;

const MobileHeaderLinks = () => {
  return (
    <nav className="absolute top-full lg:hidden left-0 right-0 rounded-b-[10px] flex flex-col gap-2 p-4 bg-darkestturq bg-opacity-100 z-50">
      <Link
        data-content="На главную"
        className=" text-lightgray text-lg 
            before:hover:bg-gradient-to-r
            before:hover:from-turquoise transition duration-300 before:opacity-0 
            hover:before:opacity-100 before:hover:to-lightblue
             before:hover:bg-clip-text 
            hover:text-opacity-0 before:font-medium font-medium
            hover:before:content-[attr(data-content)] hover:relative
            hover:before:absolute  hover:!drop-shadow-[0_0_1px_#4cf2f8]"
        to={ROUTES.LANDING.path}
      >
        На главную
      </Link>
      <Link
        data-content="Турниры"
        className=" text-lightgray text-lg 
            before:hover:bg-gradient-to-r
            before:hover:from-turquoise transition duration-300 before:opacity-0 
            hover:before:opacity-100 before:hover:to-lightblue
             before:hover:bg-clip-text 
            hover:text-opacity-0 before:font-medium font-medium
            hover:before:content-[attr(data-content)] hover:relative
            hover:before:absolute  hover:!drop-shadow-[0_0_1px_#4cf2f8]"
        to={ROUTES.TOURNAMENTS.path}
      >
        Турниры
      </Link>
    </nav>
  );
};

const Header = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const image = useAppSelector((state) => state.user.userDetails?.image);
  const name = useAppSelector((state) => state.user.userDetails?.name);
  const team = useAppSelector((state) => state.user.userDetails?.team);

  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const [areMobileLinkVisible, setAreMobileLinkVisible] = useState(false);

  return (
    <header
      className={
        "flex lg:justify-between text-lightgray items-center h-[78px] relative lg:gap-8 " +
        (areMobileLinkVisible ? "bg-darkestturq lg:bg-transparent" : "")
      }
    >
      {areMobileLinkVisible && <MobileHeaderLinks />}
      <button
        onClick={() => setAreMobileLinkVisible((p) => !p)}
        className="lg:hidden ml-2"
      >
        <svg
          width="32"
          height="25"
          viewBox="0 0 32 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_766_643)">
            <path
              d="M17.5567 19.4H5.17261M26.0299 12.2H5.17261M26.0299 5H5.17261"
              stroke="#18A3DC"
              strokeOpacity="0.5"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M17.5567 19.4H5.17261M26.0299 12.2H5.17261M26.0299 5H5.17261"
            stroke="#18A3DC"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <filter
              id="filter0_f_766_643"
              x="0.172607"
              y="0"
              width="30.8573"
              height="24.3999"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="2"
                result="effect1_foregroundBlur_766_643"
              />
            </filter>
          </defs>
        </svg>
      </button>
      <Link
        className="ml-12 lg:ml-0 flex items-center justify-center text-lg gap-3"
        to={ROUTES.TOURNAMENTS.path}
      >
        <img
          width="40"
          height="40"
          src={`${serverURL}/media/img/logo.svg`}
          alt="логотип"
          className="neonshadow transition duration-300"
        />
        SignalCup
      </Link>
      <div className=" justify-start w-1/2 mt-[1px] mr-auto gap-8 hidden lg:flex">
        <Link
          data-content="На главную"
          className=" text-lightgray text-lg 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0 before:font-medium font-medium
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute  hover:!drop-shadow-[0_0_1px_#4cf2f8]"
          to={ROUTES.LANDING.path}
        >
          На главную
        </Link>
        <Link
          data-content="Турниры"
          className=" text-lightgray text-lg 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0 before:font-medium font-medium
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute  hover:!drop-shadow-[0_0_1px_#4cf2f8]"
          to={ROUTES.TOURNAMENTS.path}
        >
          Турниры
        </Link>
      </div>
      {isAuthenticated ? (
        <>
          <div
            className=" absolute flex flex-col
                        right-0 top-2 z-50 "
            role="menuitem"
            onClick={() => setIsDropDownVisible((prev) => !prev)}
          >
            <div
              className={
                (isDropDownVisible &&
                  "bg-darkestturq !bg-opacity-100 hover:!bg-darkestturq rounded-[10px] lg:!rounded-b-none") +
                " relative flex flex-row justify-between items-center gap-[20px] rounded-[10px] transition-colors hover:bg-turquoise hover:bg-opacity-20 py-2 px-3"
              }
            >
              <img
                src={
                  image
                    ? `${serverURL}/${image}`
                    : `${serverURL}/media/img/defaultuser.svg`
                }
                alt=""
                className=" rounded-full w-[45px] h-[45px]"
              />
              <span
                data-content={name}
                className="hidden lg:block before:text-lg text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow"
              >
                {name}
              </span>

              <img
                src={`${serverURL}/media/img/accordion.svg`}
                alt=""
                className={
                  "neonshadow mt-[1px] transition hidden lg:block " +
                  (isDropDownVisible ? "rotate-90" : "rotate-0")
                }
              />
            </div>
            {isDropDownVisible && (
              <div
                className={
                  (isDropDownVisible && "bg-darkestturq") +
                  " z-[100] absolute -left-16 -bottom-32 right-0 lg:bottom-0 lg:left-0 lg:relative flex flex-col justify-between items-center rounded-[10px] lg:rounded-t-none  transition-colors hover:bg-darkestturq "
                }
              >
                <NavLink
                  to={ROUTES.DASHBOARD.buildPath({})}
                  className={({ isActive }) =>
                    (isActive && "text-turquoise bg-turquoise bg-opacity-20") +
                    " text-base  font-medium text-left w-full grow py-[9px] hover:text-turquoise hover:bg-turquoise hover:bg-opacity-20 transition px-4 rounded-t-[10px] lg:rounded-none"
                  }
                >
                  Мой профиль
                </NavLink>
                <NavLink
                  to={
                    team
                      ? ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: team })
                      : ROUTES.TEAMS.CREATE.buildPath({})
                  }
                  className={({ isActive }) =>
                    (isActive && "text-turquoise bg-turquoise bg-opacity-20") +
                    " text-base  font-medium text-left w-full grow py-[9px] hover:text-turquoise hover:bg-turquoise hover:bg-opacity-20 transition px-4"
                  }
                  role="menuitem"
                >
                  {team ? "Команда" : "Создать/найти команду"}
                </NavLink>
                <button
                  onClick={() => {
                    dispatch(logout());
                  }}
                  className="text-base font-medium text-left w-full grow py-[9px] hover:text-turquoise hover:bg-turquoise hover:bg-opacity-20 transition px-4 rounded-b-[10px]"
                  role="menuitem"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center gap-0 lg:gap-3 flex-col lg:flex-row ml-auto lg:m-0">
          <Link
            className=" flex gap-[19px] justify-between items-center rounded-[10px] hover:bg-turquoise hover:bg-opacity-20 active:bg-turquoise active:bg-opacity-60 lg:h-[52px] pl-5 pr-5 neonshadow transition-colors"
            to={ROUTES.LOGIN.path}
            type="button"
          >
            <img
              className="hidden lg:block"
              src={`${serverURL}/media/img/defaultuser.svg`}
              alt=""
            />
            <span
              data-content="Вход"
              className="before:text-lg mr-2 lg:mr-0 text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)]"
            >
              Вход
            </span>
          </Link>
          <span
            data-content="/"
            className="hidden lg:block before:lg:text-lg neonshadow font-black before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow scale-150 mx-2 mb-1"
          >
            /
          </span>
          <Link
            to={ROUTES.REGISTER_ACCOUNT.path}
            type="button"
            data-content="Регистрация"
            className="hidden lg:flex before:lg:text-lg lg:text-lg before:font-semibold before:bg-gradient-to-r before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                        before:absolute relative before:content-[attr(data-content)] neonshadow rounded-[10px] hover:bg-turquoise hover:bg-opacity-20 lg:h-[52px] px-4 items-center transition-colors
                        active:bg-turquoise active:bg-opacity-60"
          >
            <span className="">Регистрация</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

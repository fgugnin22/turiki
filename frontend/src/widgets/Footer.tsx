import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";

const serverURL = import.meta.env.VITE_API_URL;
const Footer = () => {
  return (
    <footer className="mt-auto pt-14 pb-20 grid grid-cols-1 px-4 lg:px-0 lg:grid-cols-4 items-start justify-between ">
      <div className="flex justify-start items-center gap-3 lg:gap-[30px]">
        <img
          width="40"
          height="40"
          src={`${serverURL}/media/img/logo.svg`}
          alt="логотип"
        />
        <span
          data-content="Signal Cup"
          className="text-xl font-extrabold bg-gradient-to-r from-turquoise bg-clip-text to-lightblue text-transparent
                        content-[attr(data-content)]"
        >
          Signal Cup
        </span>
      </div>
      <div className="flex flex-col gap-2 lg:gap-0 lg:justify-between items-start lg:min-h-[120px] mt-[9px]">
        <Link
          data-content="На главную"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          На главную
        </Link>
        <Link
          data-content="Баны"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Баны
        </Link>
        <Link
          data-content="Разработчики"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Разработчики
        </Link>
      </div>
      <div className="flex flex-col gap-2 lg:gap-0 lg:justify-between items-start lg:min-h-[120px] mt-2 lg:mt-[9px]">
        <Link
          data-content="Поддержка"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Поддержка
        </Link>
        <Link
          data-content="Вакансии"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Вакансии
        </Link>
        <Link
          data-content="Условия"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Условия
        </Link>
      </div>
      <div className="flex flex-col justify-between items-start lg:min-h-[120px] mt-[9px]">
        <Link
          data-content="Политика конфиденциальности"
          className=" text-lightgray 
                    before:hover:bg-gradient-to-r
                    before:hover:from-turquoise transition duration-300 before:opacity-0 
                    hover:before:opacity-100 before:hover:to-lightblue
                     before:hover:bg-clip-text 
                    hover:text-opacity-0
                    hover:before:content-[attr(data-content)] hover:relative
                    hover:before:absolute hover:font-semibold"
          to={ROUTES.LANDING.path}
        >
          Политика конфиденциальности
        </Link>
        <div className="flex gap-4 mt-4 lg:mt-0">
          <img src={serverURL + "/media/img/discord.svg"} alt="" />
          <img src={serverURL + "/media/img/vkontakte.svg"} alt="" />
          <img src={serverURL + "/media/img/email.svg"} alt="" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

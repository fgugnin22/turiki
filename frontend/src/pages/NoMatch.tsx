import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
const NoMatch = () => {
  return (
    <div className=" min-h-screen bg-dark flex flex-col items-center justify-center">
      <h1 className="text-9xl text-center font-medium bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-center font-medium bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent text-2xl">
        Cтраница не найдена :-(
      </p>
      <p className="text-lightgray w-[340px] text-center">
        Страница, на которую вы пытаетесь попасть, не существует или была
        удалена. Перейдите на{" "}
        <Link
          className="bg-gradient-to-r font-bold bg-lightblue transition hover:bg-none duration-300 hover:bg-turquoise from-lightblue to-turquoise bg-clip-text text-transparent"
          to={ROUTES.LANDING.path}
        >
          Главную страницу
        </Link>
        <br />
        <span className="opacity-10">Ну или я где-то сплоховал</span>
      </p>
    </div>
  );
};
export default NoMatch;

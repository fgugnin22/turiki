import { Tournament } from "../helpers/transformMatches";

const serverURL = import.meta.env.VITE_API_URL;

type TournamentOverviewProps = {
  tournament: Tournament;
};

const TournamentOverview: React.FC<TournamentOverviewProps> = ({
  tournament
}) => {
  return (
    <div className="px-[15px] mx-auto w-[320px] sm:w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1100px] flex flex-col lg:gap-12 lg:flex-row lg:justify-between">
      <div>
        <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-lg lg:text-2xl mt-2 lg:mt-6">
          Подробности
        </p>
        <ul
          className="grid grid-cols-2 lg:grid-cols-3 text-xs lg:text-lg lg:leading-6
         text-gray-400 leading-[14px] gap-x-[10px] gap-y-[11px] mt-2 lg:mt-4 lg:gap-x-[37px] lg:gap-y-[63px]"
        >
          <li className="flex items-center gap-[7px] lg:gap-3">
            <img
              className="w-4 h-4 lg:w-6 lg:h-6"
              src={serverURL + "/media/img/gradcubesm.svg"}
              alt=""
            />
            <div className="flex flex-col">
              <p>Игра</p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold">
                Rainbow Six Siedge
              </p>
            </div>
          </li>
          <li className="flex items-center gap-[7px] lg:gap-3">
            <img
              className="w-4 h-4 lg:w-6 lg:h-6"
              src={serverURL + "/media/img/gradcubesm.svg"}
              alt=""
            />
            <div className="flex flex-col">
              <p>Античит</p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold">
                Обязательно
              </p>
            </div>
          </li>
          <li className="flex items-center gap-[7px] lg:gap-3">
            <img
              className="w-4 h-4 lg:w-6 lg:h-6"
              src={serverURL + "/media/img/gradcubesm.svg"}
              alt=""
            />
            <div className="flex flex-col">
              <p>Призовой фонд</p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold">
                {tournament.prize}
              </p>
            </div>
          </li>
          <li className="flex items-center gap-[7px] lg:gap-3">
            <img
              className="w-4 h-4 lg:w-6 lg:h-6"
              src={serverURL + "/media/img/gradcubesm.svg"}
              alt=""
            />
            <div className="flex flex-col">
              <p>Участники</p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold">
                {tournament.teams.length}/{2 ** tournament.max_rounds}
              </p>
            </div>
          </li>
          <li className="flex items-center gap-[7px] lg:gap-3">
            <img
              className="w-4 h-4 lg:w-6 lg:h-6"
              src={serverURL + "/media/img/gradcubesm.svg"}
              alt=""
            />
            <div className="flex flex-col">
              <p>Формат</p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold">
                Single Elimination
              </p>
            </div>
          </li>
          {/* <li className="flex items-center gap-[7px] lg:gap-3">
          <img className="w-4 h-4 lg:w-6 lg:h-6" src={serverURL + "/media/img/gradcubesm.svg"} alt="" />
          <div className="flex flex-col">
            <p>Регистрация</p>
            <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold"></p>
          </div>
        </li> */}
        </ul>
        <div className="hidden lg:block">
          <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xl mt-7">
            Информация
          </p>
          <p className="text-sm text-lightgray leading-5 mt-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
            vero repudiandae voluptatem maiores culpa consequatur, suscipit quis
            sint natus voluptate quia tempore impedit sapiente quo eos, rem
            quisquam asperiores atque.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-7 mt-7 lg:min-w-[340px]">
        <div className="">
          <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-lg lg:text-xl">
            Призы
          </p>
          <div className="flex lg:flex-col justify-between gap-2 mt-2">
            <div
              className="before:bg-gradient-to-tr after:rounded-[9px] before:rounded-[10px] before:z-0 after:z-10 before:absolute after:absolute relative before:from-lightblue before:to-turquoise 
          before:top-0 before:bottom-0 before:left-0 before:right-0 after:bg-dark after:top-[1px]
        after:bottom-[1px] after:left-[1px] after:right-[1px] py-[6px] flex flex-col items-center justify-center grow lg:justify-between lg:flex-row lg:h-[60px] lg:px-7 w-24 lg:w-full"
            >
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                1st
              </p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                10000р
              </p>
            </div>
            <div
              className="before:bg-gradient-to-tr after:rounded-[9px] before:rounded-[10px] before:z-0 after:z-10 before:absolute after:absolute relative before:from-lightblue before:to-turquoise 
          before:top-0 before:bottom-0 before:left-0 before:right-0 after:bg-dark after:top-[1px]
        after:bottom-[1px] after:left-[1px] after:right-[1px] py-[6px] flex flex-col items-center justify-center grow lg:justify-between lg:flex-row lg:h-[60px] lg:px-7 w-24 lg:w-full"
            >
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                2nd
              </p>
              <p className="text-lightgray relative z-30 text-xs lg:text-lg">
                1000р
              </p>
            </div>
            <div
              className="before:bg-gradient-to-tr after:rounded-[9px] before:rounded-[10px] before:z-0 after:z-10 before:absolute after:absolute relative before:from-lightblue before:to-turquoise 
          before:top-0 before:bottom-0 before:left-0 before:right-0 after:bg-dark after:top-[1px]
        after:bottom-[1px] after:left-[1px] after:right-[1px] py-[6px] flex flex-col items-center justify-center grow lg:justify-between lg:flex-row lg:h-[60px] lg:px-7 w-24 lg:w-full"
            >
              <p className="text-lightgray relative z-30 text-xs lg:text-lg">
                3-4th
              </p>
              <p className="text-lightgray relative z-30 text-xs lg:text-lg">
                100р
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-lg lg:text-xl">
            Требования
          </p>
          <div className="flex lg:flex-col justify-between gap-2 mt-2">
            <div
              className="before:bg-gradient-to-tr after:rounded-[9px] before:rounded-[10px] before:z-0 after:z-10 before:absolute after:absolute relative before:from-lightblue before:to-turquoise 
          before:top-0 before:bottom-0 before:left-0 before:right-0 after:bg-dark after:top-[1px]
        after:bottom-[1px] after:left-[1px] after:right-[1px] py-[6px] flex flex-col items-center justify-center grow lg:justify-between lg:flex-row lg:h-[60px] lg:px-7 w-24 lg:w-full"
            >
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                Skill level
              </p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                Любой
              </p>
            </div>
            <div
              className="before:bg-gradient-to-tr after:rounded-[9px] before:rounded-[10px] before:z-0 after:z-10 before:absolute after:absolute relative before:from-lightblue before:to-turquoise 
          before:top-0 before:bottom-0 before:left-0 before:right-0 after:bg-dark after:top-[1px]
        after:bottom-[1px] after:left-[1px] after:right-[1px] py-[6px] flex flex-col items-center justify-center grow lg:justify-between lg:flex-row lg:h-[60px] lg:px-7 w-24 lg:w-full"
            >
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                Регион
              </p>
              <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-xs relative z-30 lg:text-lg">
                СНГ
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <p className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent font-bold text-lg mt-7">
          Информация
        </p>
        <p className="text-sm text-lightgray mt-1 leading-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          vero repudiandae voluptatem maiores culpa consequatur, suscipit quis
          sint natus voluptate quia tempore impedit sapiente quo eos, rem
          quisquam asperiores atque.
        </p>
      </div>
    </div>
  );
};

export default TournamentOverview;

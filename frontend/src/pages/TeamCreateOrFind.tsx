import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { getUser } from "../shared/rtk/user";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";
import ButtonMain from "../shared/ButtonMain";
const serverURL = import.meta.env.VITE_API_URL;

const TeamCreateOrFind = () => {
  const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
  const [createTeam] = tournamentAPI.useCreateTeamMutation();
  const [leaveFromTeam] = tournamentAPI.useLeaveFromTeamMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: teamList,
    isError,
    isLoading,
    isSuccess
  } = tournamentAPI.useTeamListQuery(null);
  const [refetchTeams] = tournamentAPI.useLazyTeamListQuery();
  const [search, setSearch] = useState("");
  const {
    isAuthenticated,
    userDetails: user,
    loading,
    loginFail
  } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    teamName: ""
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    await createTeam(formData.teamName);
    const res = await dispatch(getUser(localStorage.getItem("access")!));
    return navigate(
      ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: res?.payload?.team }),
      {
        replace: true
      }
    );
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    return setFormData({ ...formData, [target.name]: target.value });
  };
  const filterTeams = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    return setSearch(target.value);
  };

  if (!isAuthenticated && !loading && loginFail) {
    return <Layout>Необходима авторизация!</Layout>;
  }

  if (
    isAuthenticated &&
    user?.team &&
    user.team_status !== "PENDING" &&
    user.team_status !== "REJECTED"
  ) {
    navigate(ROUTES.TEAMS.TEAM_BY_ID.buildPath({ id: user.team }));
  }

  return (
    <Layout>
      {(!user?.team || user?.team_status === "PENDING") && (
        <div className="flex justify-center my-[5%]">
          <div className=" w-full sm:w-4/5">
            <h2
              data-content="Создать команду"
              className="before:text-[30px] before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center text-[30px] before:w-full before:text-center before:font-extrabold font-extrabold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] mb-2"
            >
              Создать команду
            </h2>
            <p className="font-medium text-base opacity-70 mb-2 text-center">
              Нельзя создать команду при открытой заявке на вступление в другую
              команду
            </p>
            <form
              className="flex gap-3 lg:gap-8 flex-col lg:flex-row"
              onSubmit={onSubmit}
            >
              <div
                className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               w-full lg:w-4/5 mr-auto"
              >
                <input
                  className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 autofill:bg-transparent placeholder:text-lightblue text-lightblue"
                  type="text"
                  placeholder="Название команды"
                  name="teamName"
                  value={formData.teamName}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                  minLength={3}
                  required
                />
              </div>
              <ButtonMain
                className="py-3 focus:py-[10px] active:py-[10px] grow px-6 focus:px-[22px] active:px-[22.5px] disabled:opacity-60 disabled:line-through"
                type="submit"
                disabled={!!user?.team}
              >
                Сохранить
              </ButtonMain>
            </form>
            <div className="mt-8">
              <h2
                data-content="Найти команду"
                className="before:text-[30px] before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center text-[30px] before:w-full before:text-center before:font-extrabold font-extrabold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] mb-2"
              >
                Найти команду
              </h2>
              <p className="font-medium text-base opacity-70 mb-2">
                Подать заявку можно только в одну команду!
              </p>

              <div
                className="rounded-[10px] relative after:absolute 
                                before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                             after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                               before:z-10 z-20 before:bg-dark before:rounded-[9px] bg-transparent h-12
                               w-full"
              >
                <input
                  onChange={filterTeams}
                  value={search}
                  placeholder="Найти команду"
                  type="text"
                  name="teamName"
                  className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-20 bg-transparent outline-none px-3 autofill:bg-transparent placeholder:text-lightblue text-lightblue"
                />
              </div>

              <div className="flex flex-col gap-5 lg:gap-6 mt-8 lg:h-[392px]">
                {teamList
                  ?.filter((team) =>
                    team.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(page * 4, page * 4 + 4)
                  .sort((t1, t2) => t2.id - t1.id)
                  .map((team) => {
                    const cap = team.players.find(
                      (p) => p.team_status === "CAPTAIN"
                    );
                    return (
                      <Link
                        to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({
                          id: team.id
                        })}
                        className={`shadow mx-auto w-full relative hover:bg-turquoise hover:before:bg-opacity-60 before:transition before:duration-200 lg:h-20 bg-transparent
                    flex  text-center justify-between  items-center rounded-[10px] after:absolute 
                    before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                  after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                    before:z-10 z-20 before:bg-dark before:rounded-[9px]`}
                        key={team.id}
                      >
                        <div className="relative flex flex-col lg:flex-row items-center justify-evenly flex-nowrap z-30 w-full h-full">
                          <div className="flex lg:w-[30%] py-6 overflow-clip h-full items-center  lg:border-r border-lightblue z-30">
                            <p
                              data-content={team.name}
                              className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-center text-lg before:w-full font-semibold  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] grow z-20 break-words"
                            >
                              {team.name}
                            </p>
                          </div>
                          <div className="h-[1px] relative z-50 w-full bg-gradient-to-r from-lightblue to-turquoise lg:hidden"></div>

                          <div className="flex items-center justify-center gap-1 z-20 lg:w-[28%] mt-6 lg:mt-0">
                            <p
                              data-content={cap?.name}
                              className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-left text-lg before:w-full font-semibold before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                            >
                              {cap?.name}
                            </p>
                            <img
                              src={`${serverURL}/media/img/crown.svg`}
                              className=""
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1 z-20 lg:w-[28%] mt-6 lg:mt-0">
                            <p
                              data-content={"Игроков: " + team.players.length}
                              className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0 text-left text-lg before:w-full font-semibold before:text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                            >
                              {"Игроков: " + team.players.length}
                            </p>
                          </div>
                          {team.is_open ? (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault();

                                if (!user) {
                                  return;
                                }

                                if (
                                  user?.team_status === "PENDING" &&
                                  team.players.find((p) => p.id === user.id)
                                ) {
                                  await leaveFromTeam(team.id);
                                } else {
                                  await applyForTeam(team.id);
                                }
                                await dispatch(
                                  getUser(localStorage.getItem("access")!)
                                );
                              }}
                              className={
                                "w-9 h-9 mr-2 rounded-[10px] transition flex items-center justify-center bg-turquoise bg-opacity-30 hover:bg-opacity-40 my-6 lg:my-0 " +
                                `${
                                  user?.team_status === "PENDING" &&
                                  !team.players.find((p) => p.id === user.id)
                                    ? " opacity-0"
                                    : ""
                                }`
                              }
                            >
                              <svg
                                className={`transition duration-300 ${
                                  user?.team_status === "PENDING" &&
                                  team.players.find((p) => p.id === user.id)
                                    ? " rotate-45"
                                    : ""
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18.0841 8.10189H11.5157V1.89838C11.5157 1.10774 10.8371 0.466797 9.9999 0.466797C9.16276 0.466797 8.48411 1.10774 8.48411 1.89838V8.10189H1.91569C1.07854 8.10189 0.399902 8.74283 0.399902 9.53347C0.399902 10.3241 1.07854 10.965 1.91569 10.965H8.48411V17.1686C8.48411 17.9592 9.16276 18.6001 9.9999 18.6001C10.8371 18.6001 11.5157 17.9592 11.5157 17.1686V10.965H18.0841C18.9213 10.965 19.5999 10.3241 19.5999 9.53347C19.5999 8.74283 18.9213 8.10189 18.0841 8.10189Z"
                                  fill="url(#paint0_linear_436_967)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear_436_967"
                                    x1="30.2104"
                                    y1="-9.55426"
                                    x2="-7.90274"
                                    y2="30.8009"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="#21DBD3" />
                                    <stop offset="1" stopColor="#18A3DC" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </button>
                          ) : (
                            <svg
                              className="w-6 h-6 mr-2 flex items-center justify-center"
                              width="16"
                              height="21"
                              viewBox="0 0 16 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.75 7.22222V6.33333C2.75 3.37884 5.09167 1 8 1C10.9083 1 13.25 3.37884 13.25 6.33333V7.22222M2.75 7.22222C1.7875 7.22222 1 8.02222 1 9V17.8889C1 18.8667 1.7875 19.6667 2.75 19.6667H13.25C14.2125 19.6667 15 18.8667 15 17.8889V9C15 8.02222 14.2125 7.22222 13.25 7.22222M2.75 7.22222H13.25M8 14.4167V12.0833"
                                stroke="url(#paint0_linear_466_1251)"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_466_1251"
                                  x1="14.8057"
                                  y1="0.611206"
                                  x2="1.19464"
                                  y2="20.0556"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#21DBD3" />
                                  <stop offset="1" stopColor="#18A3DC" />
                                </linearGradient>
                              </defs>
                            </svg>
                          )}
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
            <div className="w-full flex justify-center items-center mt-6 gap-[10px] text-turquoise text-base font-medium">
              <button
                onClick={() =>
                  setPage((p) => {
                    return Math.max(p - 1, 0);
                  })
                }
              >
                <svg width="7" height="9" viewBox="0 0 7 9" fill="none">
                  <path
                    d="M0.859853 5.25251C0.40462 4.85411 0.40462 4.14589 0.859853 3.74749L4.62594 0.451531C5.2725 -0.114319 6.28452 0.344842 6.28452 1.20405V7.79596C6.28452 8.65516 5.2725 9.11432 4.62594 8.54847L0.859853 5.25251Z"
                    fill="#21DBD3"
                  />
                </svg>
              </button>
              <span>
                {page + 1} /{" "}
                {Math.ceil(
                  (teamList?.filter((team) =>
                    team.name.toLowerCase().includes(search.toLowerCase())
                  )?.length ?? 0) / 4
                )}
              </span>
              <button
                onClick={() =>
                  setPage((p) => {
                    return Math.min(
                      p + 1,
                      Math.ceil(
                        (teamList?.filter((team) =>
                          team.name.toLowerCase().includes(search.toLowerCase())
                        )?.length ?? 0) / 4
                      ) - 1
                    );
                  })
                }
              >
                <svg
                  width="6"
                  height="9"
                  viewBox="0 0 6 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.42482 3.74749C5.88005 4.14589 5.88005 4.85411 5.42482 5.25251L1.65873 8.54847C1.01217 9.11432 0.000151634 8.65516 0.000151634 7.79595L0.000151634 1.20404C0.000151634 0.344841 1.01216 -0.11432 1.65873 0.45153L5.42482 3.74749Z"
                    fill="#21DBD3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TeamCreateOrFind;

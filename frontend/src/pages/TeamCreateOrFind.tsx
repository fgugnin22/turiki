import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { getUser } from "../shared/rtk/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../app/RouteTypes";
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
  const [filteredTeamList, setFilteredTeamList] = useState("");
  const {
    isAuthenticated,
    userDetails: user,
    loading
  } = useAppSelector((state) => state.user);
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
    return setFilteredTeamList(target.value);
  };
  if (!isAuthenticated && !loading) {
    return <Layout>Необходима авторизация!</Layout>;
  }
  return (
    <Layout>
      {(!user?.team || user?.team_status === "PENDING") && (
        <div className="flex justify-center my-[5%]">
          <div className="max-w-[600px]">
            <p className="text-center mb-1 font-semibold text-2xl">
              Зарегистрировать команду
            </p>
            <form onSubmit={onSubmit}>
              <div className="relative mb-3">
                <input
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  type="text"
                  placeholder="Название команды"
                  name="teamName"
                  value={formData.teamName}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onChange(e)
                  }
                  required
                />
                {user?.team_status === "PENDING" && (
                  <p className="font-thin text-[10px] w-72">
                    Нельзя создать команду при открытой заявке на вступление в
                    другую команду, сначала отмените заявку
                  </p>
                )}
              </div>
              <button
                className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                type="submit"
                disabled={!!user?.team}
              >
                Сохранить
              </button>
            </form>
            <div className="mt-8">
              <h3 className="mb-2">
                Подать заявку можно только в одну команду!
              </h3>
              <input
                onChange={filterTeams}
                value={filteredTeamList}
                placeholder="Найти команду"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />

              <div className="max-h-[300px] mt-0.5 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-thumb-rounded-lg scrollbar-track-rounded-xl scrollbar-track-gray-100">
                {teamList
                  ?.filter((team) =>
                    team.name
                      .toLowerCase()
                      .includes(filteredTeamList.toLowerCase())
                  )
                  .map((team) => (
                    // тут еще картинка должна быть
                    <div
                      className="py-2 px-4 first:border-none border-t-2 text-sm"
                      key={team.id}
                    >
                      {team.name}
                      {!user?.team_status && (
                        <button
                          onClick={async () => {
                            if (!user) {
                              return;
                            }
                            await applyForTeam(team.id);
                            await dispatch(
                              getUser(localStorage.getItem("access")!)
                            );
                          }}
                          className="px-4 bg-slate-300 hover:bg-slate-400 transition rounded-md float-right"
                        >
                          +
                        </button>
                      )}
                      {user?.team_status === "PENDING" &&
                        team.players.find(
                          (player) => player.name === user.name
                        ) && (
                          <button
                            onClick={async () => {
                              if (!user) {
                                return;
                              }
                              await leaveFromTeam(team.id);
                              await dispatch(
                                getUser(localStorage.getItem("access")!)
                              );
                            }}
                            className="px-4 bg-green-600 hover:bg-red-600 transition rounded-md float-right"
                          >
                            -
                          </button>
                        )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TeamCreateOrFind;

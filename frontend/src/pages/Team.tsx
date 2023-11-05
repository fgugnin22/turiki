import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import FileInput from "../shared/FileUploadSingle";
import FileUploadSingle from "../shared/FileUploadSingle";
import { getUser } from "../shared/rtk/user";
import { ROUTES } from "../app/RouteTypes";

const Team = () => {
  const dispatch = useAppDispatch();
  const { userDetails: user, isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  const params = useParams();
  const [acceptPlayerToTeam] = tournamentAPI.useInvitePlayerToTeamMutation();
  const [kickPlayerFromTeam] = tournamentAPI.useKickPlayerFromTeamMutation();
  const [leaveFromTeam] = tournamentAPI.useLeaveFromTeamMutation();
  const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
  const { data, isLoading, isError, isSuccess } =
    tournamentAPI.useGetTeamByIdQuery(params.id);
  const navigate = useNavigate();
  return (
    <Layout>
      <h2 className="mx-auto my-8 text-xl">{data?.name}</h2>
      {isSuccess && (
        <>
          {data.players.map((player, i: number) => {
            if (player.team_status == "PENDING") {
              return (
                <div
                  key={player.id}
                  className="shadow h-10  mx-auto w-72 relative mb-4 py-2 rounded-md flex text-center justify-between items-center gap-x-2"
                >
                  {/* Иконка игрока */}
                  <span className="my-2 mx-4">{player.name}</span>
                  <p className="font-thin text-[10px] mr-auto">в ожидании</p>
                  {user?.team_status === "CAPTAIN" &&
                    user?.team === data?.id && (
                      <button
                        onClick={() => {
                          acceptPlayerToTeam({
                            teamId: Number(params.id),
                            player_id: player.id
                          });
                        }}
                        className="w-10 h-10 text-sm font-light py-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white min-w-24 transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                      >
                        +
                      </button>
                    )}
                  {player.id === user?.id && (
                    <button
                      onClick={async () => {
                        if (!user || !params) {
                          return;
                        }
                        await leaveFromTeam(Number(params?.id));
                        await dispatch(
                          getUser(localStorage.getItem("access")!)
                        );
                      }}
                      className="w-10 h-10 text-sm font-light py-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white min-w-24 transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                    >
                      -
                    </button>
                  )}
                </div>
              );
            } else {
              return (
                <div
                  key={player.id}
                  className="shadow h-10 mx-auto w-72 relative mb-4 py-2 rounded-md flex text-center justify-between items-center gap-x-2"
                >
                  {/* Иконка игрока */}
                  <span className="my-2 mx-4">{player.name}</span>
                  <p className="font-thin text-[10px] mr-auto">
                    {player?.team_status === "CAPTAIN"
                      ? "капитан"
                      : "в составе"}
                  </p>
                  {user?.team_status === "CAPTAIN" &&
                    user?.team === data?.id && (
                      <button
                        onClick={async () => {
                          const res = await kickPlayerFromTeam({
                            teamId: Number(params.id),
                            player_id: player.id
                          });
                          await dispatch(
                            getUser(localStorage.getItem("access")!)
                          );
                          console.log(res);
                          if (data.players.length === 1) {
                            return navigate(ROUTES.DASHBOARD.path, {
                              replace: true
                            });
                          }
                        }}
                        className="w-10 h-10 text-sm font-light py-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white min-w-24 transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                      >
                        -
                      </button>
                    )}
                </div>
              );
            }
          })}
          {isSuccess && isAuthenticated && !user?.team_status && (
            <button
              className="py-2 px-4 w-20 mx-auto mb-4 block bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg "
              onClick={async () => {
                if (!user || !params) {
                  return;
                }
                await applyForTeam(Number(params?.id));
                await dispatch(getUser(localStorage.getItem("access")!));
              }}
            >
              +
            </button>
          )}
          {/* <FileUploadSingle /> */}
        </>
      )}
    </Layout>
  );
};

export default Team;

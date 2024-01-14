import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { getUser, uploadTeamImage } from "../shared/rtk/user";
import { ROUTES } from "../shared/RouteTypes";
const serverURL = import.meta.env.VITE_API_URL;

const Team = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userDetails: user } = useAppSelector((state) => state.user);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const team = useAppSelector((state) => state.user.userDetails?.team);
  const team_status = useAppSelector(
    (state) => state.user.userDetails?.team_status
  );
  const id = useAppSelector((state) => state.user.userDetails?.id);

  const params = useParams();
  const [acceptPlayerToTeam] = tournamentAPI.useInvitePlayerToTeamMutation();
  const [kickPlayerFromTeam] = tournamentAPI.useKickPlayerFromTeamMutation();
  const [leaveFromTeam] = tournamentAPI.useLeaveFromTeamMutation();
  const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
  const { data, isLoading, isError, isSuccess } =
    tournamentAPI.useGetTeamByIdQuery(params.id);
  const onImageSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    if (!target.files || !data) {
      return;
    }
    const formData = new FormData();
    formData.append("image", target.files[0]);
    console.log(target.files[0]);
    await dispatch(uploadTeamImage({ formData, teamId: data.id }));
    window.location.reload();
  };
  return (
    <Layout>
      {isSuccess && (
        <>
          <div className="flex max-w-md mx-auto mt-8 flex-wrap items-center !text-lightgray">
            <img
              alt="profil"
              src={serverURL + "/" + data?.image}
              className="object-cover rounded-full h-16 w-16 border-2 border-slate-600 ml-auto mr-4"
            />
            <h2 className="ml-2 mr-auto text-2xl">{data.name}</h2>

            {team_status === "CAPTAIN" && team === Number(params.id) && (
              <div className="mt-4 mx-auto max-w-sm w-[80%] flex flex-wrap items-center">
                <label
                  className="grow w-full block mr-0 ml-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white text-center py-auto py-3 px-4 rounded-md border-0 text-sm font-semibold cursor-pointer"
                  htmlFor="file_input"
                >
                  Загрузить картинку
                </label>
                <input
                  onChange={onImageSubmit}
                  id="file_input"
                  type="file"
                  accept="image/png"
                  hidden
                />
                <p className="mt-1 text-sm mx-auto" id="file_input_help">
                  PNG (макс. 800x400px).
                </p>
              </div>
            )}
          </div>
          <p className="mx-auto relative right-4 mt-4">
            {data.players.length && "Игроки:"}
          </p>
          {data.players.map((player, i: number) => {
            if (player.team_status == "PENDING") {
              return (
                <div
                  key={player.id}
                  className="shadow h-10 mt-2 mx-auto w-72 relative mb-4 py-2 rounded-md flex text-center justify-between items-center gap-x-2 text-lightgray"
                >
                  {/* Иконка игрока */}
                  <span className="my-2 mx-4">{player.name}</span>
                  <p className="font-thin text-[10px] mr-auto">
                    в ожидании {player.id === id && "(Вы)"}
                  </p>
                  {team_status === "CAPTAIN" && team === data?.id && (
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
                  {player.id === id && (
                    <button
                      onClick={async () => {
                        if (id || !params) {
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
                  className="shadow h-10 mt-2 mx-auto w-72 relative mb-4 py-2 rounded-md flex text-center justify-between items-center gap-x-2 text-lightgray"
                >
                  {/* Иконка игрока */}
                  <span className="my-2 mx-4">{player.name}</span>
                  <p className="font-thin text-[10px] mr-auto">
                    {player?.team_status === "CAPTAIN"
                      ? "капитан"
                      : "в составе"}{" "}
                    {player.id === id && "(Вы)"}
                  </p>
                  {team_status === "CAPTAIN" && team === data?.id && (
                    <button
                      onClick={async () => {
                        const res = await kickPlayerFromTeam({
                          teamId: Number(params.id),
                          player_id: player.id
                        });
                        await dispatch(
                          getUser(localStorage.getItem("access")!)
                        );
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
          {isSuccess && isAuthenticated && !team_status && (
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

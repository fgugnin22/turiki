import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { getUser, uploadTeamImage } from "../shared/rtk/user";
import { ROUTES } from "../shared/RouteTypes";
import Dots from "../shared/Dots";
import ButtonMain from "../shared/ButtonMain";
import { getImagePath } from "../helpers/getImagePath";
const serverURL = import.meta.env.VITE_API_URL;

const Team = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const teamId = useAppSelector((state) => state.user.userDetails?.team);
  const team_status = useAppSelector(
    (state) => state.user.userDetails?.team_status
  );
  const id = useAppSelector((state) => state.user.userDetails?.id);

  const [acceptPlayerToTeam] = tournamentAPI.useInvitePlayerToTeamMutation();
  const [kickPlayerFromTeam] = tournamentAPI.useKickPlayerFromTeamMutation();
  const [leaveFromTeam] = tournamentAPI.useLeaveFromTeamMutation();
  const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
  const [changeTeamName] = tournamentAPI.useChangeTeamNameMutation();
  const [openOrCloseTeam] = tournamentAPI.useTeamOpennessMutation();
  const [makeCaptain] = tournamentAPI.useMakeCaptainMutation();
  const [changeDesc] = tournamentAPI.useChangeTeamDescriptionMutation();
  const [changeJoinConfirm] = tournamentAPI.useChangeTeamJoinConfirmMutation();

  const { data, isLoading, isError } = tournamentAPI.useGetTeamByIdQuery(
    params.id
  );
  const [inviteClicked, setInviteClicked] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [playerDropdowns, setPlayerDropdowns] = useState(-1);

  const [showInput, setShowInput] = useState(false);
  const [showSaveDescBtn, setShowSaveDescBtn] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const onImageSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLInputElement;

    if (!target.files || !data) {
      return;
    }

    const formData = new FormData();

    formData.append("image", target.files[0]);

    await dispatch(uploadTeamImage({ formData, teamId: data.id }));

    window.location.reload();
  };

  const handleLeaveTeamClick = async () => {
    await leaveFromTeam(Number(params?.id));

    await dispatch(getUser(localStorage.getItem("access")!));

    navigate(ROUTES.TEAMS.CREATE.path);
  };

  const canChangeTeamName =
    Number(teamId) === Number(params.id) && team_status === "CAPTAIN";

  useEffect(() => {
    if (data?.description && newTeamDescription === "") {
      setNewTeamDescription(data.description);
    }
  }, [data?.description]);

  if (isError) {
    navigate(ROUTES.TEAMS.CREATE.path);
  }

  return (
    <Layout>
      {data && (
        <>
          <div
            className="rounded-[10px] mt-16 relative after:absolute 
        before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
      after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
        before:z-10 z-20 
        py-4 px-6 sm:py-12 sm:px-16 w-full sm:w-[70%] lg:w-1/2 mx-auto before:bg-dark before:rounded-[9px]  
        before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[3000%]"
          >
            <button
              onClick={() => setDropdown((p) => !p)}
              className={
                "absolute top-2 right-2 z-30 w-9 h-9 flex items-center justify-center transition " +
                "sm:top-4 sm:right-4 rounded-[10px] hover:bg-turquoise hover:bg-opacity-30 z-50"
              }
            >
              <Dots />
            </button>
            {dropdown && teamId === data?.id && (
              <div className="absolute  transition z-[90] flex flex-col gap-1 py-[15px] px-4 right-[60px] top-4 bg-darkestturq rounded-[10px]">
                <button
                  onClick={handleLeaveTeamClick}
                  className="hover:text-lightblue active:text-turquoise transition font-medium"
                >
                  Покинуть команду
                </button>
                {team_status === "CAPTAIN" && (
                  <>
                    <button
                      onClick={() =>
                        openOrCloseTeam({
                          teamId: data.id,
                          is_open: !data.is_open
                        })
                      }
                      className="hover:text-lightblue active:text-turquoise transition font-medium"
                    >
                      {data.is_open ? "Сделать закрытой" : "Сделать открытой"}
                    </button>
                    {data.is_open && (
                      <button
                        onClick={() =>
                          changeJoinConfirm({
                            teamId: data.id,
                            join_confirm: !data.is_join_confirmation_necessary
                          })
                        }
                        className="hover:text-lightblue active:text-turquoise transition font-medium"
                      >
                        {!data.is_join_confirmation_necessary
                          ? "Вход по заявкам"
                          : "Вход без заявок"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="flex relative z-30 flex-col">
              <div className="flex flex-col gap-4 lg:flex-row items-center justify-between lg:justify-start lg:gap-10 text-2xl font-semibold">
                <label
                  style={{
                    gridTemplateAreas: "a"
                  }}
                  className="grid w-28 h-28"
                  htmlFor="file_input"
                >
                  {data?.image && (
                    <img
                      style={{ gridArea: "a" }}
                      alt="profil"
                      src={serverURL + "/" + getImagePath(data.image)}
                      className="object-cover  object-center rounded-full ml-[3%] mt-[3%] h-[94%] w-[94%]  relative z-10 aspect-square	"
                    />
                  )}
                  {team_status === "CAPTAIN" && (
                    <>
                      <img
                        style={{ gridArea: "a" }}
                        src={serverURL + "/media/img/uploadround.svg"}
                        className={
                          "object-cover opacity-0 hover:opacity-100 object-center rounded-full h-full w-full relative z-30 transition aspect-square	" +
                          (!data?.image ? " !opacity-100" : " opacity-0")
                        }
                        alt=""
                      />
                      <input
                        onChange={onImageSubmit}
                        id="file_input"
                        type="file"
                        accept="image/png"
                        hidden
                      />
                    </>
                  )}
                </label>
                <div className="flex items-center justify-between w-full lg:w-3/5">
                  {showInput && canChangeTeamName ? (
                    <div
                      className="rounded-[10px] relative right-3 after:absolute 
                            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
                          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                            before:z-10 z-40 before:bg-darkestturq bg-transparent h-12
                            w-full mx-auto before:rounded-[9px]"
                    >
                      <form
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          e.preventDefault();
                          changeTeamName({
                            teamId: Number(params.id),
                            newName: newTeamName.trim()
                          });
                          setShowInput(false);
                        }}
                      >
                        <input
                          type="text"
                          placeholder={`${data?.name}`}
                          name="newTeamName"
                          value={newTeamName}
                          onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            const target = e.target as HTMLInputElement;
                            setNewTeamName(target.value);
                          }}
                          minLength={3}
                          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full z-40 bg-transparent outline-none px-3 text-lightgray rounded-[10px] text-2xl"
                          required
                        />
                        <button
                          type="submit"
                          className="absolute right-0 top-0 bottom-0 w-12 bg-turquoise z-50 rounded-r-[10px] flex items-center justify-center"
                        >
                          <svg
                            className="w-9 h-9"
                            fill="#fff"
                            viewBox="0 0 256 256"
                            id="Flat"
                          >
                            <path d="M103.99951,188.00012a3.98852,3.98852,0,0,1-2.82812-1.17139l-56-55.9956a3.99992,3.99992,0,0,1,5.65625-5.65723l53.17187,53.16748L213.17139,69.1759a3.99992,3.99992,0,0,1,5.65625,5.65723l-112,111.9956A3.98855,3.98855,0,0,1,103.99951,188.00012Z" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span
                      data-content={data?.name ?? ""}
                      className="z-40 before:w-full text-left before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
                    >
                      {data?.name ?? ""}
                    </span>
                  )}
                  <button onClick={() => setShowInput((p) => !p)}>
                    {canChangeTeamName &&
                      (showInput ? (
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 18 17"
                          fill="none"
                          className="rotate-[42deg] transition"
                        >
                          <path
                            d="M16.5789 6.8502H10.4211V1.28441C10.4211 0.575051 9.78483 0 9 0C8.21517 0 7.57895 0.575051 7.57895 1.28441V6.8502H1.42105C0.636226 6.8502 0 7.42525 0 8.13462C0 8.84398 0.636226 9.41903 1.42105 9.41903H7.57895V14.9848C7.57895 15.6942 8.21517 16.2692 9 16.2692C9.78483 16.2692 10.4211 15.6942 10.4211 14.9848V9.41903H16.5789C17.3638 9.41903 18 8.84398 18 8.13462C18 7.42525 17.3638 6.8502 16.5789 6.8502Z"
                            fill="url(#paint0_linear_466_1089)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_466_1089"
                              x1="27.9474"
                              y1="-8.99089"
                              x2="-6.12936"
                              y2="28.711"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#21DBD3" />
                              <stop offset="1" stopColor="#18A3DC" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : (
                        <svg
                          className="relative top-[1px]"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.88611 1.75414L10.809 0.80216C11.8822 -0.267385 13.622 -0.267387 14.6952 0.802158C15.7683 1.8717 15.7683 3.60578 14.6952 4.67533L13.9653 5.37822L9.88611 1.75414ZM8.78916 2.88561L0.842392 11.0825L0 15.5L4.38044 14.6088L12.8278 6.47367L8.78916 2.88561Z"
                            fill="#21DBD3"
                          />
                        </svg>
                      ))}
                  </button>
                </div>
              </div>
              {team_status === "CAPTAIN" &&
              data.players.findIndex((p) => p.id === id) >= 0 ? (
                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    changeDesc({
                      description: newTeamDescription.trim(),
                      teamId: teamId ?? -1
                    });
                    setShowSaveDescBtn(false);
                  }}
                >
                  <label htmlFor="desc" className="text-turquoise text-lg">
                    Описание команды
                  </label>
                  <textarea
                    id="desc"
                    name="description"
                    className="w-full h-full bg-transparent outline-none border-turquoise
                  border rounded-[10px] px-1 text-lightgray"
                    onChange={(e) => {
                      setShowSaveDescBtn(e.target.value !== data.description);
                      setNewTeamDescription(e.target.value);
                    }}
                    value={newTeamDescription}
                    maxLength={128}
                  ></textarea>
                  {showSaveDescBtn && (
                    <ButtonMain className="py-2 w-full focus:py-[7px] active:py-[7px]">
                      Сохранить
                    </ButtonMain>
                  )}
                </form>
              ) : (
                data.description && (
                  <p className="text-lightblue mt-2 -mb-1 text-lg">
                    Описание: {data.description}
                  </p>
                )
              )}
              <div
                className="flex max-h-[300px] flex-col gap-8 mt-8 w-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-turquoise 
        scrollbar-track-transparent scrollbar-corner-transparent overflow-y-scroll relative"
              >
                {data.players.map((player, i: number) => {
                  if (
                    player.team_status === "PENDING" ||
                    player.team_status === "REJECTED"
                  ) {
                    return;
                  }

                  return (
                    <div
                      className="flex justify-start gap-6 items-center ml-2 relative"
                      key={player.id + "member"}
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          Number(player?.image?.length) > 0
                            ? serverURL + "/" + getImagePath(player.image!)
                            : serverURL + "/media/img/defaultuser.svg"
                        }
                        alt=""
                      />
                      <div className="flex items-center justify-start gap-[10px]">
                        <span className="bg-gradient-to-r font-medium from-lightblue to-turquoise bg-clip-text text-transparent">
                          {player.name ||
                            player.game_name ||
                            player.email.split("@")[0]}
                        </span>
                        {player?.team_status === "CAPTAIN" && (
                          <img
                            src={`${serverURL}/media/img/crown.svg`}
                            className="ml-1 block"
                          />
                        )}
                        <span className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent">
                          {player.id === id && "(Вы)"}
                        </span>
                      </div>

                      {player.id !== id && team_status === "CAPTAIN" && (
                        <button
                          onClick={() => {
                            setPlayerDropdowns((prev) => {
                              return prev === player.id ? -1 : player.id;
                            });
                          }}
                          className="ml-auto w-9 h-9 flex items-center justify-center transition sm:top-4 sm:right-4 rounded-[10px] hover:bg-turquoise hover:bg-opacity-30"
                        >
                          <Dots />
                        </button>
                      )}
                      {playerDropdowns === player.id &&
                        team_status === "CAPTAIN" && (
                          <div className="absolute transition z-[90] flex flex-col gap-[1px] py-2 px-3 right-10 top-[2px] bg-darkestturq rounded-[10px]">
                            <button
                              onClick={() =>
                                kickPlayerFromTeam({
                                  teamId: data.id,
                                  player_id: player.id
                                })
                              }
                              className="hover:text-lightblue active:text-turquoise transition font-base text-base"
                            >
                              Кикнуть игрока
                            </button>
                            <button
                              onClick={() =>
                                makeCaptain({
                                  teamId: data.id,
                                  new_cap_id: player.id
                                })
                              }
                              className="hover:text-lightblue active:text-turquoise transition font-base text-base"
                            >
                              Сделать капитаном
                            </button>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
              {String(teamId) === String(params.id) ? (
                <ButtonMain
                  onClick={async () => {
                    setInviteClicked(true);
                    await navigator.clipboard.writeText(location.href);
                    setTimeout(() => setInviteClicked(false), 3000);
                  }}
                  className="mt-8 text-base px-0 lg:text-lg font-semibold py-3 active:py-[10px] focus:py-[10px]"
                >
                  {inviteClicked
                    ? "Ссылка скопирована!"
                    : "Поделиться ссылкой на команду"}
                </ButtonMain>
              ) : (
                isAuthenticated && (
                  <ButtonMain
                    onClick={async () => {
                      applyForTeam(Number(params!.id));
                    }}
                    className="mt-8 font-semibold text-lg py-3 active:py-[10px] focus:py-[10px]"
                  >
                    {"Отправить заявку на вступление в команду"}
                  </ButtonMain>
                )
              )}
            </div>
          </div>
          <p
            data-content={"Заявки на вступление"}
            className="
            bg-gradient-to-r font-semibold text-xl from-lightblue to-turquoise bg-clip-text text-transparent mx-auto text-center mt-12"
          >
            {"Заявки на вступление"}
          </p>
          <div className="flex flex-col mx-auto gap-8 mt-8 w-[90%] sm:w-3/5 lg:w-2/5 ">
            {data.players.map((player, i: number) => {
              if (player.team_status === "PENDING") {
                return (
                  <div
                    className="flex justify-start gap-6 items-center"
                    key={player.id + "pending"}
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        Number(player?.image?.length) > 0
                          ? serverURL + "/" + getImagePath(player.image!)
                          : serverURL + "/media/img/defaultuser.svg"
                      }
                      alt=""
                    />
                    <div className="flex items-center  font-medium justify-start gap-[10px]">
                      <span className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent">
                        {player.name ||
                          player.game_name ||
                          player.email.split("@")[0]}
                      </span>
                      <span className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent">
                        {player.id === id && "(Вы)"}
                      </span>
                    </div>
                    {player.id !== id && team_status === "CAPTAIN" && (
                      <div className="flex items-center justify-center gap-2 ml-auto">
                        <button
                          onClick={() => {
                            acceptPlayerToTeam({
                              teamId: Number(params.id!),
                              player_id: player.id
                            });
                          }}
                          className="w-8 h-8 flex items-center justify-center transition sm:top-4 sm:right-4 rounded-[10px] hover:bg-turquoise hover:bg-opacity-30"
                        >
                          <svg
                            width="18"
                            height="17"
                            viewBox="0 0 18 17"
                            fill="none"
                          >
                            <path
                              d="M16.5789 6.8502H10.4211V1.28441C10.4211 0.575051 9.78483 0 9 0C8.21517 0 7.57895 0.575051 7.57895 1.28441V6.8502H1.42105C0.636226 6.8502 0 7.42525 0 8.13462C0 8.84398 0.636226 9.41903 1.42105 9.41903H7.57895V14.9848C7.57895 15.6942 8.21517 16.2692 9 16.2692C9.78483 16.2692 10.4211 15.6942 10.4211 14.9848V9.41903H16.5789C17.3638 9.41903 18 8.84398 18 8.13462C18 7.42525 17.3638 6.8502 16.5789 6.8502Z"
                              fill="url(#paint0_linear_466_1089)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_466_1089"
                                x1="27.9474"
                                y1="-8.99089"
                                x2="-6.12936"
                                y2="28.711"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#21DBD3" />
                                <stop offset="1" stopColor="#18A3DC" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            kickPlayerFromTeam({
                              teamId: Number(params.id!),
                              player_id: player.id
                            });
                          }}
                          className="w-8 h-8 flex items-center justify-center transition sm:top-4 sm:right-4 rounded-[10px] hover:bg-turquoise hover:bg-opacity-30"
                        >
                          <svg
                            width="17"
                            height="2"
                            viewBox="0 0 17 2"
                            fill="none"
                          >
                            <path
                              d="M15.4 0.999999L1 1"
                              stroke="#21DBD3"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
            })}
            {!data.is_open && (
              <div>
                <svg
                  className="w-6 h-6 mx-auto -mt-5 flex items-center justify-center opacity-60"
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
                <p
                  data-content={"Заявки закрыты"}
                  className="
            bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent mx-auto text-center mt-2"
                >
                  {"Заявки закрыты"}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Team;

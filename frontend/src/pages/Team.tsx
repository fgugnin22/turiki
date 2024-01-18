import React, { useState } from "react";
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
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const teamId = useAppSelector((state) => state.user.userDetails?.team);
  const team_status = useAppSelector(
    (state) => state.user.userDetails?.team_status
  );
  const id = useAppSelector((state) => state.user.userDetails?.id);
  const params = useParams();
  const [acceptPlayerToTeam] = tournamentAPI.useInvitePlayerToTeamMutation();
  const [kickPlayerFromTeam] = tournamentAPI.useKickPlayerFromTeamMutation();
  const [leaveFromTeam] = tournamentAPI.useLeaveFromTeamMutation();
  const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
  const [changeTeamName] = tournamentAPI.useChangeTeamNameMutation();
  const { data, isLoading, isError, isSuccess } =
    tournamentAPI.useGetTeamByIdQuery(params.id);
  const [inviteClicked, setInviteClicked] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [playerDropdowns, setPlayerDropdowns] = useState(-1);

  const [showInput, setShowInput] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
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
          <div
            className="rounded-[10px] mt-16 relative after:absolute 
        before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
      after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
        before:z-10 z-20 
        py-4 px-6 sm:py-12 sm:px-16 w-full sm:w-[70%] lg:w-1/2 mx-auto before:bg-dark before:rounded-[9px]  
        before:bg-gradient-to-b before:from-transparent from-[-100%] before:to-darkturquoise before:to-[900%]"
          >
            <button
              onClick={() => setDropdown((p) => !p)}
              className={
                "absolute top-2 right-2 z-30 w-9 h-9 flex items-center justify-center transition " +
                "sm:top-4 sm:right-4 rounded-[10px] hover:bg-turquoise hover:bg-opacity-30 "
              }
            >
              <Dots />
            </button>
            {dropdown && teamId === data?.id && (
              <div className="absolute  transition z-[90] flex flex-col gap-1 py-[15px] px-4 right-4 top-[58px] bg-darkestturq rounded-[10px]">
                <button
                  onClick={() => leaveFromTeam(Number(params?.id))}
                  className="hover:text-lightblue active:text-turquoise transition font-medium"
                >
                  Покинуть команду
                </button>
                {team_status === "CAPTAIN" && (
                  <button
                    onClick={() =>
                      alert("JOKES ON YOU \nI DID NOT FINISH THIS")
                    }
                    className="hover:text-lightblue active:text-turquoise transition font-medium"
                  >
                    Сделать закрытой
                  </button>
                )}
              </div>
            )}
            <div className="flex relative z-30 flex-col">
              <div className="flex items-center justify-between lg:justify-start lg:gap-10 text-2xl font-semibold">
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
                    <img
                      style={{ gridArea: "a" }}
                      src={serverURL + "/assets/img/uploadround.svg"}
                      className={
                        "object-cover opacity-0 hover:opacity-100 object-center rounded-full h-full w-full relative z-30 hover:!drop-shadow-[0_0_1px_#4cf2f8] transition aspect-square	" +
                        (!data?.image ? " !opacity-100" : " opacity-0")
                      }
                      alt=""
                    />
                  )}
                  <input
                    onChange={onImageSubmit}
                    id="file_input"
                    type="file"
                    accept="image/png"
                    hidden
                  />
                </label>
                <div className="flex items-center justify-between w-3/5">
                  {showInput ? (
                    <div
                      className="rounded-[10px] relative right-3 after:absolute 
                            before:absolute after:inset-0 before:inset-[1px] after:bg-gradient-to-r
                          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
                            before:z-10 z-40 before:bg-darkestturq bg-transparent h-12
                            w-full mx-auto"
                    >
                      <form
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          e.preventDefault();
                          changeTeamName({
                            teamId: Number(params.id),
                            newName: newTeamName
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
                          className="absolute inset-0 z-40 bg-transparent outline-none px-3 text-lightgray text-2xl"
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
                    {showInput ? (
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
                    )}
                  </button>
                </div>
              </div>
              <div
                className="flex max-h-[300px] flex-col gap-8 mt-8 w-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-turquoise 
        scrollbar-track-transparent scrollbar-corner-transparent overflow-y-scroll relative"
              >
                {data.players
                  // .toSorted((plr) => {
                  //   return plr.team_status === "CAPTAIN" ? -12 : 12;
                  // })
                  .map((player, i: number) => {
                    if (player.team_status === "PENDING") {
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
                              : serverURL +
                                "/assets/img/userdefaultloggedin.svg"
                          }
                          alt=""
                        />
                        <div className="flex items-center justify-start gap-[10px]">
                          <span className="bg-gradient-to-r font-medium from-lightblue to-turquoise bg-clip-text text-transparent">
                            {player.name}
                          </span>
                          {player?.team_status === "CAPTAIN" && (
                            <img
                              src={`${serverURL}/assets/img/crown.svg`}
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
                            <div className="absolute transition z-[90] flex flex-col gap-[1px] py-2 px-3 right-0 bottom-10 bg-darkestturq rounded-[10px]">
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
                                  alert("JOKES ON YOU \nI DID NOT FINISH THIS")
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
              {/* {isSuccess && isAuthenticated && !team_status && (
              <button
                onClick={async () => {
                  if (!isAuthenticated || !params) {
                    return;
                  }
                  await applyForTeam(Number(params?.id));
                  await dispatch(getUser(localStorage.getItem("access")!));
                }}
              >
                +
              </button>
            )} */}
              {String(teamId) === String(params.id) ? (
                <ButtonMain
                  onClick={async () => {
                    setInviteClicked(true);
                    await navigator.clipboard.writeText(location.href);
                    setTimeout(() => setInviteClicked(false), 3000);
                  }}
                  className="mt-8 font-semibold text-lg py-3 active:py-[10px] focus:py-[10px]"
                >
                  {inviteClicked
                    ? "Ссылка скопирована в буфер обмена!"
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
            bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent mx-auto text-center mt-16"
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
                          : serverURL + "/assets/img/userdefaultloggedin.svg"
                      }
                      alt=""
                    />
                    <div className="flex items-center  font-medium justify-start gap-[10px]">
                      <span className="bg-gradient-to-r from-lightblue to-turquoise bg-clip-text text-transparent">
                        {player.name}
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
          </div>
        </>
      )}
    </Layout>
  );
};

export default Team;

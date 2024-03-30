import React, { useEffect, useRef, useState } from "react";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";

import { Team } from "../helpers/transformMatches";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
const serverURL = import.meta.env.VITE_API_URL;
const checkURL = `url(${serverURL}/media/img/check.svg)`;
const RegisterTeamModal = ({
  team,
  tournamentId,
  maxPlayers,
  tournamentStatus,
  isTeamNotRegistered
}: {
  team: Team;
  tournamentId: number;
  maxPlayers: number;
  tournamentStatus: string;
  isTeamNotRegistered: boolean;
}) => {
  const [submitError, setSubmitError] = useState<any>(false);
  const [formState, setFormState] = useState<boolean[]>([]);
  const checkHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setSubmitError(false);
    const target = e.target as HTMLInputElement;
    setFormState((prev) => {
      prev[Number(target.value)] = !prev[Number(target.value)];
      return [...prev];
    });
  };
  const [registerTeam, { isSuccess: isRegisterSuccess }] =
    tournamentAPI.useRegisterTeamOnTournamentMutation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const sumbitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(false);
    const assignedPlayers = team?.players
      .filter((player, index) => {
        return (
          formState[index] &&
          player.team_status !== "PENDING" &&
          player.team_status !== "REJECTED"
        );
      })
      .map((player) => player.id);

    if (assignedPlayers?.length !== maxPlayers) {
      setSubmitError(`Выберите ${maxPlayers} игроков`);
      return;
    }
    registerTeam({
      tournamentId,
      players: assignedPlayers,
      teamId: team.id,
      action:
        location.pathname === "/adminboard" ||
        (tournamentStatus === "REGISTRATION_OPENED" && isTeamNotRegistered)
          ? "REGISTER"
          : "CHANGE"
    })
      .unwrap()
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        setSubmitError(error.data[0]);
      });
    // setShowModal(false);
  };
  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      setShowModal(false);
    }
  });

  return (
    <>
      <ButtonMain
        onClick={() => setShowModal(true)}
        className=" py-1 px-2 focus:py-[2px] focus:px-[6px] active:py-[2px] active:px-[6px] after:!bg-gradient-to-l"
        type="button"
      >
        {tournamentStatus === "REGISTRATION_OPENED" && isTeamNotRegistered
          ? "Зарегистрировать команду"
          : "Изменить регистрацию"}
      </ButtonMain>
      {showModal ? (
        <>
          <div className="fixed top-0 bottom-0 left-0 right-0 z-[90] overflow-y-auto flex items-center pb-48 ">
            <div
              className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-lightblue opacity-10"
              onClick={() => setShowModal(false)}
            ></div>
            <div
              className="rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px] 
            before:bg-gradient-to-b before:from-transparent before:to-darkturquoise before:to-[350%] py-9 px-12 flex flex-col max-w-[460px]"
            >
              <h2
                data-content="Выберите с кем будете играть"
                className="before:text-[28px] z-50 before:left-0 top-0  w-full text-center text-[28px]  before:text-center before:font-semibold before:bg-gradient-to-r 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:relative relative before:content-[attr(data-content)]"
              ></h2>
              <form className=" z-50" onSubmit={sumbitHandler}>
                <ul className="mt-8 mb-1 flex flex-col gap-7">
                  {team &&
                    team.players
                      .filter(
                        (player) =>
                          player.team_status !== "PENDING" &&
                          player.team_status !== "REJECTED"
                      )
                      .map((player, index) => {
                        return (
                          <li
                            key={player.id}
                            className=" flex justify-start flex-nowrap gap-5 items-center"
                          >
                            <input
                              id={String(player.id) + "input"}
                              type="checkbox"
                              checked={formState[index]}
                              style={{
                                backgroundImage: checkURL,
                                backgroundSize: "19px"
                              }}
                              onChange={checkHandler}
                              value={index}
                              data-url={checkURL}
                              className={`appearance-none w-[30px] h-[30px] rounded-[10px] border border-lightgray
                             bg-opacity-0 
                             hover:border-turquoise transition duration-200 bg-no-repeat !bg-[1000px] checked:!bg-[5px] checked:bg-darkturquoise checked:bg-opacity-30 checked:border-lightblue`}
                            />
                            <label
                              htmlFor={String(player.id) + "input"}
                              className="hover:text-turquoise text-lightgray transition active:text-lightblue text-xl"
                            >
                              {player.name ||
                                player.game_name ||
                                player.email.split("@")[0] ||
                                player.game_name ||
                                player.email.split("@")[0]}
                            </label>
                          </li>
                        );
                      })}
                </ul>
                <p className=" text-warning mb-4">
                  {submitError ? submitError + "!" : ""}
                </p>
                <div className="flex justify-between">
                  <ButtonMain className="py-3 px-[19px] focus:py-[10px] focus:px-[18px] active:py-[10px] active:px-[18px] text-xl font-semibold">
                    {"Зарегистрировать"}
                  </ButtonMain>
                  <ButtonSecondary
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="py-3 px-[19px] text-xl font-semibold text-lightgray"
                  >
                    <span
                      data-content="Отмена"
                      className="z-40 before:w-full before:text-center before:bg-gradient-to-b 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)] before:hover:bg-none before:hover:bg-turquoise"
                    >
                      Отмена
                    </span>
                  </ButtonSecondary>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default RegisterTeamModal;

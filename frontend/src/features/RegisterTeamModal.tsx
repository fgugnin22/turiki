import React, { useEffect, useRef, useState } from "react";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";

import { Team } from "../helpers/transformMatches";
import ButtonMain from "../shared/ButtonMain";
import ButtonSecondary from "../shared/ButtonSecondary";
const serverURL = import.meta.env.VITE_API_URL;
const checkURL = `url(${serverURL}/assets/img/check.svg)`;
const RegisterTeamModal = ({
  team,
  tournamentId
}: {
  team: Team;
  tournamentId: number;
}) => {
  const stackLength = Number(import.meta.env.VITE_STACK_LENGTH);
  const [submitError, setSubmitError] = useState<any>(false);
  const [formState, setFormState] = useState<boolean[]>([]);
  const checkHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setSubmitError(false);
    const target = e.target as HTMLInputElement;
    target.style.backgroundImage = target.checked ? checkURL : "";
    target.style.backgroundPositionY = "2px";
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
    const assignedPlayers = team?.players
      .filter((player, index) => {
        return (
          formState[index] &&
          player.team_status !== "PENDING" &&
          player.team_status !== "REJECTED"
        );
      })
      .map((player) => player.id);

    if (assignedPlayers?.length !== stackLength) {
      setSubmitError(`Выберите ${stackLength} игроков`);
      return;
    }
    registerTeam({
      tournamentId,
      players: assignedPlayers,
      teamId: team.id
    })
      .unwrap()
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        setSubmitError(error.data[0]);
      });
    setShowModal(false);
  };
  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      setShowModal(false);
    }
  });
  return (
    <>
      <button
        onMouseOver={() => setSubmitError(false)}
        className=""
        type="button"
        onClick={() => {
          setSubmitError(false);
          setShowModal(true);
        }}
      >
        {submitError ? submitError : "Зарегистрировать команду"}
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto flex items-center pb-48 ">
            <div
              className="fixed inset-0 w-full h-full bg-lightblue opacity-10"
              onClick={() => setShowModal(false)}
            ></div>
            <div
              className="rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:inset-0 before:inset-[2px] after:bg-gradient-to-r
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
                <ul className="mt-8 mb-8 flex flex-col gap-7">
                  {team &&
                    team.players.map((player, index) => {
                      return (
                        <li
                          key={player.id}
                          className=" flex justify-start flex-nowrap gap-5 items-center"
                        >
                          <input
                            id={String(player.id)}
                            type="checkbox"
                            checked={formState[index]}
                            onChange={checkHandler}
                            value={index}
                            data-url={checkURL}
                            className={`appearance-none w-[30px] h-[30px] rounded-[10px] border border-lightgray
                             bg-opacity-0 checked:bg-opacity-100
                             hover:border-turquoise transition duration-200 checked:border-lightblue neonshadow`}
                          />
                          <label
                            htmlFor={String(player.id)}
                            className="hover:text-turquoise transition active:text-lightblue text-xl"
                          >
                            {player.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
                <div className="flex justify-between">
                  <ButtonMain className="py-3 px-[19px] focus:py-[10px] focus:px-[18px] active:py-[10px] active:px-[18px] text-xl font-semibold">
                    Зарегистрировать
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

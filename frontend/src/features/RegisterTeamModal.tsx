import React, { useState } from "react";
import { tournamentAPI } from "../rtk/tournamentAPI";

import { Team } from "../helpers/transformMatches";
const RegisterTeamModal = ({
    team,
    tournamentId
}: {
    team: Team;
    tournamentId: number;
}) => {
    const stackLength = Number(import.meta.env.VITE_STACK_LENGTH);
    const [submitError, setSubmitError] = useState(false);
    const [formState, setFormState] = useState<boolean[]>([]);
    const checkHandler = (e: React.FormEvent<HTMLInputElement>) => {
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
            console.log("there", stackLength === assignedPlayers?.length);
            setSubmitError(true);
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
            .catch(() => setSubmitError(true));
        setShowModal(false);
    };
    return (
        <>
            <div className="flex items-center justify-center">
                <button
                    className="px-6 py-3 text-purple-100 bg-purple-600 rounded-md"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    Register Team
                </button>
            </div>
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-10"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                <div className="mt-3 sm:flex">
                                    <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            Выберите с кем будете играть
                                        </h4>
                                        <form onSubmit={sumbitHandler}>
                                            <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                {
                                                    team &&
                                                        team.players.map(
                                                            (player, index) => {
                                                                // if (
                                                                //     player.id ===
                                                                //     userDetails?.id
                                                                // ) {
                                                                //     return;
                                                                // }
                                                                return (
                                                                    <li
                                                                        key={
                                                                            player.id
                                                                        }
                                                                        className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                                                                    >
                                                                        <div className="flex items-center pl-3">
                                                                            <input
                                                                                id={String(
                                                                                    player.id
                                                                                )}
                                                                                type="checkbox"
                                                                                checked={
                                                                                    formState[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                                onChange={
                                                                                    checkHandler
                                                                                }
                                                                                value={
                                                                                    index
                                                                                }
                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:ring-offset-gray-700   dark:bg-gray-600 dark:border-gray-500"
                                                                            />
                                                                            <label
                                                                                htmlFor={String(
                                                                                    player.id
                                                                                )}
                                                                                className="w-full py-3 ml-2 text-md font-medium text-gray-900 dark:text-gray-300"
                                                                            >
                                                                                {
                                                                                    player.name
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            }
                                                        ) /*  */
                                                }
                                            </ul>
                                            <div className="items-center gap-2 mt-3 sm:flex">
                                                <button
                                                    type="submit"
                                                    className="w-full mt-2 p-2.5 flex-1 text-white bg-lime-600 rounded-md outline-none"
                                                >
                                                    Зарегистрировать
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                    onClick={() =>
                                                        setShowModal(false)
                                                    }
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};
export default RegisterTeamModal;

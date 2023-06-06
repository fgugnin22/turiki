import React from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../rtk/store";
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
export interface Team {
    id: number;
    name: string;
    tournaments: Tournament[];
}

export interface Tournament {
    id: number;
    name: string;
    prize: number;
    registration_opened: boolean;
    starts: string;
    active: boolean;
    played: boolean;
}

const Team = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
    const params = useParams();
    const [updateStatus] = tournamentAPI.useUpdateTeamMemberStatusMutation();
    const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
    const { data, isLoading, isError, isSuccess } =
        tournamentAPI.useGetTeamByIdQuery(params.id);

    return (
        <Layout>
            {data?.name}

            {isSuccess && isAuthenticated && !user?.team_status && (
                <button
                    onClick={() => {
                        if (!user) {
                            return;
                        }
                        return applyForTeam({
                            teamId: params.id,
                            userId: user.id,
                            userName: user.name
                        });
                    }}
                >
                    Подать заявку на вступление
                </button>
            )}
            {isSuccess &&
                data.players.map((player: any, i: number) => {
                    if (player.team_status == "PENDING") {
                        return (
                            <p key={i} className="p-2 bg-lime-300 text-center">
                                {player.name}
                                <button
                                    // teamId, userId, userName, status
                                    onClick={() => {
                                        updateStatus({
                                            teamId: params.id,
                                            userId: player.id,
                                            userName: player.name,
                                            status: "ACTIVE"
                                        });
                                    }}
                                    className="p-2 rounded border-4 border-purple-500"
                                >
                                    Добавить в команду
                                </button>
                            </p>
                        );
                    } else {
                        return (
                            <p key={i} className="p-2 bg-slate-300 text-center">
                                {player.name}
                                {user?.team_status === "CAPTAIN" &&
                                    user?.team === data?.id && (
                                        <button
                                            onClick={() => {
                                                updateStatus({
                                                    teamId: params.id,
                                                    userId: player.id,
                                                    userName: player.name,
                                                    status: "REJECTED"
                                                });
                                            }}
                                            className="p-2 rounded border-4 border-red-500"
                                        >
                                            ВЫГНАТЬ НАХер!
                                        </button>
                                    )}
                            </p>
                        );
                    }
                })}
        </Layout>
    );
};

export default Team;

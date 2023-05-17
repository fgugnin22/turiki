import React from "react";
import { useParams } from "react-router-dom";
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
import Layout from "../hocs/Layout";
import { tournamentAPI } from "../rtk/tournamentAPI";
import { useSelector } from "react-redux";
const Team = () => {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [updateStatus] = tournamentAPI.useUpdateTeamMemberStatusMutation();
    const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
    const { data, isLoading, isError, isSuccess } =
        tournamentAPI.useGetTeamByIdQuery(params.id);
    // teamId, userId, userName
    return (
        <Layout>
            {data?.name}
            {isSuccess ? (
                !user?.team_status ? (
                    <button
                        onClick={() =>
                            applyForTeam({
                                teamId: params.id,
                                userId: user.id,
                                userName: user.name,
                            })
                        }
                    >
                        Подать заявку на вступление
                    </button>
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
            {isSuccess ? (
                data.players.map((player: any, i: number) => {
                    if (player.team_status == "PENDING") {
                        return (
                            <p
                                key={i}
                                className="p-2 bg-lime-300 text-center"
                                key={i}
                            >
                                {player.name}
                                <button
                                    // teamId, userId, userName, status
                                    onClick={() => {
                                        updateStatus({
                                            teamId: params.id,
                                            userId: player.id,
                                            userName: player.name,
                                            status: "ACTIVE",
                                        });
                                    }}
                                    className="p-2 rounded border-4 border-purple-500"
                                >
                                    Добавить в команду
                                </button>
                            </p>
                        );
                    } else {
                        console.log(player.name, player.team_status);
                        return (
                            <p
                                key={i}
                                className="p-2 bg-slate-300 text-center"
                                key={i}
                            >
                                {player.name}
                                <button
                                    // teamId, userId, userName, status
                                    onClick={() => {
                                        updateStatus({
                                            teamId: params.id,
                                            userId: player.id,
                                            userName: player.name,
                                            status: "REJECTED",
                                        });
                                    }}
                                    className="p-2 rounded border-4 border-red-500"
                                >
                                    ВЫГНАТЬ НАХер!
                                </button>
                            </p>
                        );
                    }
                })
            ) : (
                <></>
            )}
        </Layout>
    );
};

export default Team;

import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../shared/rtk/store";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import FileInput from "../shared/FileUploadSingle";
import FileUploadSingle from "../shared/FileUploadSingle";

const Team = () => {
    const { userDetails: user, isAuthenticated } = useAppSelector(
        (state) => state.user
    );
    const params = useParams();
    const [acceptPlayerToTeam] = tournamentAPI.useInvitePlayerToTeamMutation();
    const [kickPlayerFromTeam] = tournamentAPI.useKickPlayerFromTeamMutation();
    const [applyForTeam] = tournamentAPI.useApplyForTeamMutation();
    const { data, isLoading, isError, isSuccess } =
        tournamentAPI.useGetTeamByIdQuery(params.id);

    return (
        <Layout>
            {data?.name}

            {isSuccess && isAuthenticated && !user?.team_status && (
                <button
                    onClick={() => {
                        if (!user || !params) {
                            return;
                        }
                        return applyForTeam(Number(params?.id));
                    }}
                >
                    Подать заявку на вступление
                </button>
            )}
            {isSuccess && (
                <>
                    {data.players.map((player: any, i: number) => {
                        if (player.team_status == "PENDING") {
                            return (
                                <p
                                    key={i}
                                    className="p-2 bg-lime-300 text-center"
                                >
                                    {player.name}
                                    <button
                                        // teamId, userId, userName, status
                                        onClick={() => {
                                            acceptPlayerToTeam({
                                                teamId: Number(params.id),
                                                player_id: player.id
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
                                <p
                                    key={i}
                                    className="p-2 bg-slate-300 text-center"
                                >
                                    {player.name}
                                    {user?.team_status === "CAPTAIN" &&
                                        user?.team === data?.id && (
                                            <button
                                                onClick={() => {
                                                    kickPlayerFromTeam({
                                                        teamId: Number(
                                                            params.id
                                                        ),
                                                        player_id: player.id
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
                    <FileUploadSingle />
                </>
            )}
        </Layout>
    );
};

export default Team;

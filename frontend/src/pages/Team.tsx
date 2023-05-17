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
import { tournamentAPI } from "../rtk/tournamenAPI";
const Team = () => {
    const params = useParams();
    const { data, isLoading, isError, isSuccess } =
        tournamentAPI.useGetTeamByIdQuery(params.id);
    return (
        <Layout>
            {data?.name}
            {isSuccess ? (
                data.players.map((player: any, i: number) => (
                    <p className="p-2 bg-slate-300 text-center" key={i}>
                        {player.name}
                    </p>
                ))
            ) : (
                <></>
            )}
        </Layout>
    );
};

export default Team;

import React, { useState } from "react";
import Layout from "../hocs/Layout";
import { useSelector } from "react-redux";
import { tournamentAPI } from "../rtk/tournamenAPI";
import { Navigate } from "react-router-dom";
const TeamCreate = () => {
    const [createTeam, creationResult] = tournamentAPI.useCreateTeamMutation();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        teamName: "",
    });
    const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
    const onSubmit = (e) => {
        e.preventDefault();
        const team = {
            players: [
                {
                    name: user.name,
                },
            ],
            name: formData.teamName,
        };
        createTeam(team)
            .unwrap()
            .then(() => {})
            .catch((error) => console.log(error.originalStatus | error.status));
    };
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    if (!isAuthenticated) {
        return <Layout>You need to Log In first!</Layout>;
    }
    return (
        <Layout>
            <div className="flex justify-center my-[5%]">
                <div className="w-[450px]">
                    <p className="text-center mb-1 font-semibold text-2xl">
                        Register a Team
                    </p>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="text"
                                placeholder="Название команды"
                                name="teamName"
                                value={formData.teamName}
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </div>
                        <button
                            className="py-2 w-full px-3 bg-lime-500 hover:bg-lime-400  text-yellow-900 hover:text-yellow-800 rounded transition duration-300 flex justify-center"
                            type="submit"
                        >
                            Зарегистрировать команду
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default TeamCreate;
import React, { useState } from "react";
import { Layout } from "../processes/Layout";
import { useAppSelector } from "../shared/rtk/store";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
const TeamCreate = () => {
    const [createTeam] = tournamentAPI.useCreateTeamMutation();
    const { isAuthenticated, userDetails: user } = useAppSelector(
        (state) => state.user
    );
    const [formData, setFormData] = useState({
        teamName: ""
    });
    const inputClasses = `block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-blue-400`;
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        createTeam(formData.teamName);
    };
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        return setFormData({ ...formData, [target.name]: target.value });
    };
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
                    <form onSubmit={onSubmit}>
                        <div className="relative mb-3">
                            <input
                                className={inputClasses}
                                type="text"
                                placeholder="Название команды"
                                name="teamName"
                                value={formData.teamName}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => onChange(e)}
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

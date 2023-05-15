import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tournamentAPI = createApi({
    reducerPath: "tournamentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
        prepareHeaders: (headers) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const access = localStorage.getItem("access");
            if (access) {
                headers.set("Authorization", `JWT ${access}`);
            }
            headers.set("Accept", "*/*");
            return headers;
        },
    }),
    refetchOnFocus: true,
    tagTypes: ["Team", ""],
    endpoints: (build) => ({
        getMatchById: build.query({
            query: (search) => {
                return { url: `match/${search.id}/` };
            },
        }),
        getTournamentById: build.query({
            query: (search) => {
                return { url: `tournament/${search.id}/` };
            },
        }),
        getAllTournaments: build.query({
            query: () => {
                return { url: `tournament/` };
            },
        }),
        registerTeamOnTournament: build.mutation({
            query: ({ tournamentId, team }) => {
                return {
                    url: `tournament/${tournamentId}/`,
                    method: "PATCH",
                    body: team,
                };
            },
        }),
        createTeam: build.mutation({
            query: (team) => {
                team.matches = [];
                team.tournaments = [];
                return {
                    url: `team/`,
                    method: "POST",
                    body: team,
                };
            },
        }),
        teamList: build.query({
            query: () => {
                return {
                    url: `team/`,
                };
            },
        }),
    }),
});

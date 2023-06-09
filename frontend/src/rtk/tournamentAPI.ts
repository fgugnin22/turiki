import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Match, Team, Tournament } from "../helpers/transformMatches";
import { IChangeSelfTeamStatus, ICreateTeam, IRegisterTeam } from "../types";

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
        }
    }),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    tagTypes: ["Team", "Tournament", "Match", "Chat", ""],
    endpoints: (build) => ({
        claimMatchResult: build.mutation<
            Match,
            { participantId: number; isWinner: Boolean; matchId: number }
        >({
            query: ({ participantId, isWinner, matchId }) => {
                const body = {
                    participants: [
                        {
                            id: participantId,
                            is_winner: isWinner
                        }
                    ]
                };
                return {
                    url: `match/${matchId}/`,
                    method: "PUT",
                    body
                };
            },
            invalidatesTags: ["Match"]
        }),
        getMatchById: build.query<Match, { id: number | string }>({
            query: (search) => {
                return { url: `match/${search.id}/` };
            },
            providesTags: ["Match"]
        }),
        getTournamentById: build.query<Tournament, { id: number | string }>({
            query: (search) => {
                return { url: `tournament/${search.id}/` };
            },
            providesTags: ["Tournament"]
        }),
        getAllTournaments: build.query<Tournament[], null>({
            query: () => {
                return { url: `tournament/` };
            },
            providesTags: ["Tournament"]
        }),
        registerTeamOnTournament: build.mutation<Tournament, IRegisterTeam>({
            query: ({ tournamentId, players }) => {
                players = players.map((player, i) =>
                    Object.assign(player, { name: "sample name xfrsfasd f" })
                );
                return {
                    url: `tournament/${tournamentId}/`,
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ players })
                };
            },
            invalidatesTags: ["Tournament"]
        }),
        createTeam: build.mutation<Team, ICreateTeam>({
            query: (team) => {
                team.matches = [];
                team.tournaments = [];
                return {
                    url: `team/`,
                    method: "POST",
                    body: team
                };
            }
        }),
        teamList: build.query<Team[], null>({
            query: () => {
                return {
                    url: `team/`
                };
            },
            providesTags: ["Team"]
        }),
        getTeamById: build.query<Team, string | undefined | number>({
            query: (id) => {
                return {
                    url: `team/${id}/`
                };
            },
            providesTags: ["Team"]
        }),
        applyForTeam: build.mutation<Team, IChangeSelfTeamStatus>({
            query: ({ teamId, userId, userName }) => {
                const body = {
                    players: [
                        {
                            id: userId,
                            name: userName,
                            team_status: "PENDING"
                        }
                    ]
                };
                return {
                    method: "PUT",
                    url: `team/${teamId}/`,
                    body
                };
            },
            invalidatesTags: ["Team"]
        }),
        updateTeamMemberStatus: build.mutation<
            Team,
            { teamId: string; userId: number; userName: string; status: string }
        >({
            query: ({ teamId, userId, userName, status }) => {
                const body = {
                    players: [
                        {
                            id: userId,
                            name: userName,
                            team_status: status
                        }
                    ]
                };
                return {
                    method: "PUT",
                    url: `team/${teamId}/`,
                    body
                };
            },
            invalidatesTags: ["Team"]
        }),
        leaveFromTeam: build.mutation<Team, IChangeSelfTeamStatus>({
            query: ({ teamId, userId, userName }) => {
                const body = {
                    players: [
                        {
                            id: userId,
                            name: userName,
                            team_status: "REJECTED"
                        }
                    ]
                };
                return {
                    method: "PUT",
                    url: `team/${teamId}/`,
                    body
                };
            },
            invalidatesTags: ["Team"]
        }),
        getChatMessages: build.query({
            query: ({ chatId }) => {
                return {
                    url: `chat/${chatId}/`
                };
            },
            providesTags: ["Chat"]
        })
    })
});

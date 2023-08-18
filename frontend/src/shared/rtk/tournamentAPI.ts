import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Match, Team, Tournament } from "../../helpers/transformMatches";
import { IChangeSelfTeamStatus, ICreateTeam, IRegisterTeam } from "..";

export const tournamentAPI = createApi({
    reducerPath: "tournamentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/v2/`,
        prepareHeaders: (headers) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const access = localStorage.getItem("access");
            if (access) {
                headers.set("Authorization", `JWT ${access}`);
            }
            headers.set("Accept", "*/*");
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    tagTypes: ["Team", "Tournament", "Match", "Chat", ""],
    endpoints: (build) => ({
        claimMatchResult: build.mutation<
            null,
            { teamId: number; isWinner: Boolean; matchId: number }
        >({
            query: ({ teamId, isWinner, matchId }) => {
                const body = {
                    team: {
                        team_id: teamId,
                        result: isWinner
                    }
                };
                return {
                    url: `match/${matchId}/claim_result/`,
                    method: "PATCH",
                    body
                };
            },
            invalidatesTags: ["Match", "Tournament"]
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
        registerTeamOnTournament: build.mutation<
            null,
            { teamId: number; players: number[]; tournamentId: number }
        >({
            // {
            //     "team": {
            //         "team_id": 74,
            //         "players": [
            //             7
            //         ]
            //     }
            // }
            query: ({ tournamentId, players, teamId }) => {
                const body = JSON.stringify({
                    team: {
                        team_id: teamId,
                        players
                    }
                });
                return {
                    url: `tournament/${tournamentId}/register_team/`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body
                };
            },
            invalidatesTags: ["Tournament", "Team"]
        }),
        createBracket: build.mutation<null, number | string>({
            query: (id) => {
                return {
                    url: `tournament/${id}/bracket/`,
                    method: "POST"
                };
            }
        }),
        initializeMatches: build.mutation<null, number | string>({
            query: (id) => {
                return {
                    url: `tournament/${id}/initialize_matches/`,
                    method: "POST"
                };
            }
        }),
        createTournament: build.mutation<
            Tournament,
            {
                prize: number | string;
                name: string;
                max_rounds: number | string;
            }
        >({
            query: ({ prize, name, max_rounds }) => {
                const body = JSON.stringify({
                    name,
                    prize,
                    max_rounds
                });
                return {
                    url: `tournament/`,
                    method: "POST",
                    body
                };
            }
        }),
        createTeam: build.mutation<Team, string>({
            query: (name) => {
                const body = JSON.stringify({
                    name
                });
                return {
                    url: `team/`,
                    method: "POST",
                    body
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
        applyForTeam: build.mutation<null, number>({
            query: (teamId) => {
                return {
                    method: "PATCH",
                    url: `team/${teamId}/apply_for_team/`
                };
            },
            invalidatesTags: ["Team"]
        }),
        kickPlayerFromTeam: build.mutation<
            null,
            { teamId: number; player_id: number }
        >({
            query: ({ player_id, teamId }) => {
                const body = JSON.stringify({
                    player_id
                });
                return {
                    method: "DELETE",
                    url: `team/${teamId}/invite/`,
                    body
                };
            },
            invalidatesTags: ["Team"]
        }),
        invitePlayerToTeam: build.mutation<
            null,
            { teamId: number; player_id: number }
        >({
            query: ({ player_id, teamId }) => {
                const body = JSON.stringify({
                    player_id
                });
                return {
                    method: "PATCH",
                    url: `team/${teamId}/invite/`,
                    body
                };
            },
            invalidatesTags: ["Team"]
        }),
        leaveFromTeam: build.mutation<null, number>({
            query: (teamId) => {
                return {
                    method: "DELETE",
                    url: `team/${teamId}/apply_for_team/`
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

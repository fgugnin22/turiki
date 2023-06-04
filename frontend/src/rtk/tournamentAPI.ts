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
        }
    }),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    tagTypes: ["Team", "Tournament", "Match", "Chat", ""],
    endpoints: (build) => ({
        claimMatchResult: build.mutation({
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
        getMatchById: build.query({
            query: (search) => {
                return { url: `match/${search.id}/` };
            },
            providesTags: ["Match"]
        }),
        getTournamentById: build.query({
            query: (search) => {
                return { url: `tournament/${search.id}/` };
            },
            providesTags: ["Tournament"]
        }),
        getAllTournaments: build.query({
            query: () => {
                return { url: `tournament/` };
            },
            providesTags: ["Tournament"]
        }),
        registerTeamOnTournament: build.mutation({
            query: (tournamentId) => {
                return {
                    url: `tournament/${tournamentId}/`,
                    method: "PUT"
                };
            },
            invalidatesTags: ["Tournament"]
        }),
        createTeam: build.mutation({
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
        teamList: build.query({
            query: () => {
                return {
                    url: `team/`
                };
            },
            providesTags: ["Team"]
        }),
        getTeamById: build.query({
            query: (id) => {
                return {
                    url: `team/${id}/`
                };
            },
            providesTags: ["Team"]
        }),
        applyForTeam: build.mutation({
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
        updateTeamMemberStatus: build.mutation({
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
        leaveFromTeam: build.mutation({
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
            // onQueryStarted({chatId}, { dispatch, queryFulfilled }) {
            //     const result = dispatch(
            //         tournamentAPI.util.updateQueryData('getChatMessages', chatId, (draft) => {
            //             Object.assign(draft, patch)
            //         })
            //     )
            // },
            providesTags: ["Chat"]
        }),
        sendMessage: build.mutation({
            query: ({ content, chatId }) => {
                return {
                    url: `chat/${chatId}/`,
                    method: "PUT",
                    body: { content }
                };
            },
            invalidatesTags: ["Chat"]
        })
    })
});

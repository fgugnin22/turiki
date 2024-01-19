import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Match, Team, Tournament } from "../../helpers/transformMatches";

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
    banMap: build.mutation({
      invalidatesTags: ["Match"],
      query: ({
        teamId,
        mapName,
        matchId
      }: {
        teamId: number | string;
        mapName: string;
        matchId: number | string;
      }) => {
        const body = {
          team: { team_id: teamId },
          map: mapName
        };
        return {
          url: `match/${matchId}/ban/`,
          method: "POST",
          body
        };
      }
    }),
    claimMatchResult: build.mutation<
      null,
      { teamId: number; isWinner: Boolean; matchId: number }
    >({
      query: ({ teamId, isWinner, matchId }) => {
        const body = JSON.stringify({
          team: {
            team_id: teamId,
            result: isWinner
          }
        });
        return {
          url: `match/${matchId}/claim_result/`,
          method: "PATCH",
          body
        };
      },
      invalidatesTags: ["Match", "Tournament"]
    }),
    confirmTeamInLobby: build.mutation<
      null,
      { matchId: number | string; teamId: number | string }
    >({
      query: ({ matchId, teamId }) => {
        const body = JSON.stringify({
          team: {
            team_id: teamId
          }
        });
        return {
          method: "PUT",
          url: `match/${matchId}/team_in_lobby/`,
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
        name: string;
        prize: number & string;
        max_rounds: number & string;
        reg_starts: string;
        time_to_check_in: string;
        time_to_enter_lobby: string;
        time_results_locked: string;
        time_to_confirm_results: string;
        time_to_select_map: string;
        starts: string;
        max_player: number & string;
      }
    >({
      query: (formData) => {
        const body = JSON.stringify(formData);
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
      },
      invalidatesTags: ["Team"]
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
    }),
    changeTeamName: build.mutation<null, { teamId: number; newName: string }>({
      query: ({ teamId, newName }) => {
        return {
          method: "PATCH",
          url: `team/${teamId}/change_name/`,
          body: {
            name: newName
          }
        };
      },
      invalidatesTags: ["Team"]
    }),
    changeTournamentStatus: build.mutation<
      null,
      { id: number; status: string }
    >({
      query: ({ id, status }) => {
        return {
          method: "PATCH",
          url: `tournament/${id}/status/`,
          body: JSON.stringify({
            status
          })
        };
      },
      invalidatesTags: ["Tournament"]
    })
  })
});

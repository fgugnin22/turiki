import { route, number } from "react-router-typesafe-routes/dom";
export const ROUTES = {
  LANDING: route(""),
  DASHBOARD: route("account"),
  ADMINPAGE: route("adminboard"),
  LOGIN: route("login"),
  REGISTER_ACCOUNT: route("signup"),
  RESET_PASSWORD: route("password/reset"),
  RESET_PASSWORD_CONFIRM: route("password/reset/confirm/:uid/:token", {
    params: { id: number().defined(), token: number().defined() }
  }),
  ACTIVATE_ACCOUNT: route("activate/:uid/:token", {
    params: { uid: number().defined(), token: number().defined() }
  }),
  TEAMS: route(
    "team",
    {},
    {
      TEAM_BY_ID: route(":id", {
        params: { id: number().defined() }
      }),
      CREATE: route("create")
    }
  ),
  MATCHES: route(
    "match",
    {},
    {
      MATCH_BY_ID: route(":id", {
        params: { id: number().defined() }
      })
    }
  ),
  TOURNAMENTS: route(
    "tournaments",
    {},
    {
      TOURNAMENT_BY_ID: route(
        ":id",
        {
          params: { id: number().defined() }
        },
        {
          BRACKET: route("bracket"),
          PARTICIPANTS: route("participants"),
          RULES: route("rules"),
          RESULTS: route("results")
        }
      )
    }
  ),
  NO_MATCH404: route("*")
};

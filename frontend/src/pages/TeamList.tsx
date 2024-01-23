import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import { Link } from "react-router-dom";
import { ROUTES } from "../shared/RouteTypes";

const TeamList = () => {
  const {
    data: teamList,
    isError,
    isLoading,
    isSuccess
  } = tournamentAPI.useTeamListQuery(null);
  return (
    <Layout>
      {teamList ? (
        teamList.map((team: any, i: number) => (
          <div
            key={i}
            className="p-3 bg-slate-300 m-4 border-solid border-slate-500 border-2 rounded w-96 h-28 text-center"
          >
            <Link
              className="text-xl"
              to={ROUTES.TEAMS.TEAM_BY_ID.buildPath({
                id: team.id
              })}
            >
              {team.name}
            </Link>
          </div>
        ))
      ) : (
        <p>Loading....</p>
      )}
    </Layout>
  );
};

export default TeamList;

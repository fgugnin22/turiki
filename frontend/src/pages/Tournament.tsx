import useWindowSize from "../hooks/useWindowSize";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import transformMatches, { Root, Team } from "../helpers/transformMatches.js";
import { Layout } from "../processes/Layout.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../shared/rtk/store";
import { ROUTES } from "../app/RouteTypes";
import RegisterTeamModal from "../features/RegisterTeamModal";
export interface IMatch {
    id: number;
    nextMatchId: number | null;
    tournamentRoundText: string;
    startTime: string;
    state: string;
    participants: Team[];
}

export const Tournament = () => {
    const params = useParams();
    const tournId = Number(params["id"]);
    const { userDetails: user, isAuthenticated } = useAppSelector(
        (state) => state.user
    );
    const {
        data: tournament,
        error,
        isLoading,
        isSuccess
    } = tournamentAPI.useGetTournamentByIdQuery({
        id: tournId!
    });
    const isTeamNotRegistered =
        user &&
        isSuccess &&
        tournament &&
        !tournament.teams.some((team: Team) => Number(team.id) === user.team);
    const { data: team } = tournamentAPI.useGetTeamByIdQuery(user?.team, {
        skip: !isTeamNotRegistered
    });
    let matches: IMatch[] = [];
    const windowSize = useWindowSize();
    const navigate = useNavigate();
    const width = Math.max(500, windowSize.width);
    const height = Math.max(500, windowSize.height);
    const matchClickHandler = ({
        match
    }: {
        match: IMatch;
        topWon: boolean;
        bottomWon: boolean;
    }) => {
        navigate(`/match/${match.id}`);
    };

    return (
        <Layout>
            <div className="flex justify-center">
                <div className="w-full bg-slate-400">
                    {isTeamNotRegistered && (
                        <RegisterTeamModal
                            tournamentId={tournId}
                            team={team!}
                        />
                    )}
                </div>
                {isSuccess &&
                Object.keys(tournament).length > 0 &&
                tournament.matches.length > 0 ? (
                    <button
                        className="p-3 bg-slate-600 text-white flex items-center"
                        onClick={() =>
                            navigate(
                                ROUTES.TOURNAMENTS.TOURNAMENT_BY_ID.BRACKET.buildPath(
                                    { id: tournament.id }
                                )
                            )
                        }
                    >
                        Смотреть турнирную сетку
                    </button>
                ) : (
                    <span className="py-full text-center w-[20%] bg-orange-600 text-xl">
                        Tournament bracket in process
                    </span>
                )}
                <div className="w-full bg-slate-400"></div>
            </div>
        </Layout>
    );
};

export default Tournament;

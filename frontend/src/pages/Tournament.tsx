import useWindowSize from "../hooks/useWindowSize";
import { tournamentAPI } from "../rtk/tournamentAPI";
import transformMatches, { Root, Team } from "../helpers/transformMatches.js";
import { Layout } from "../processes/Layout.js";
import {
    SingleEliminationBracket,
    Match,
    SVGViewer,
    createTheme,
    MATCH_STATES
} from "@g-loot/react-tournament-brackets";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../rtk/store";
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

const GlootTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#F4F2FE", dark: "#707582" },
    matchBackground: { wonColor: "#2D2D59", lostColor: "#1B1D2D" },
    score: {
        background: {
            wonColor: `#10131C`,
            lostColor: "#139487"
        },
        text: {
            highlightedWonColor: "#7BF59D",
            highlightedLostColor: "#FB7E94"
        }
    },
    border: {
        color: "#292B43",
        highlightedColor: "RGBA(152,82,242,0.4)"
    },
    roundHeader: { backgroundColor: "#3B3F73", fontColor: "#F4F2FE" },
    connectorColor: "#3B3F73",
    connectorColorHighlight: "RGBA(152,82,242,0.4)",
    svgBackground: "#0F121C"
});

export const Tournament = () => {
    const params = useParams();
    const tournId = params["id"];
    const { userDetails: user, isAuthenticated } = useAppSelector(
        (state) => state.user
    );
    const { data, error, isLoading, isSuccess } =
        tournamentAPI.useGetTournamentByIdQuery({
            id: tournId!
        });
    const isTeamNotRegistered =
        user &&
        isSuccess &&
        data &&
        !data.teams.some((team: Team) => Number(team.id) === user.team);
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

    if (isSuccess) {
        matches = transformMatches(data);
    }
    return (
        <Layout>
            <div className="flex justify-center">
                <div className="w-full bg-slate-400">
                    {isTeamNotRegistered && <RegisterTeamModal team={team!} />}
                </div>
                {isSuccess &&
                Object.keys(data).length > 0 &&
                data.matches.length > 0 ? (
                    <SingleEliminationBracket
                        theme={GlootTheme}
                        matches={matches}
                        matchComponent={Match}
                        svgWrapper={({ children, ...props }) => (
                            <SVGViewer
                                width={width}
                                height={height}
                                background="rgb(11, 13, 19)"
                                SVGBackground="rgb(11, 13, 19)"
                                {...props}
                            >
                                {children}
                            </SVGViewer>
                        )}
                        onMatchClick={matchClickHandler as any}
                        onPartyClick={
                            /* partyClickHandler */ () =>
                                console.log("participant click!")
                        }
                    />
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

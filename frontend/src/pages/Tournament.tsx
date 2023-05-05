import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import {
    SingleEliminationBracket,
    Match,
    SVGViewer,
    createTheme,
} from "@g-loot/react-tournament-brackets";
export interface ITeam {
    id: string;
    resultText: string | null;
    isWinner: boolean;
    status: string | null;
    name: string;
    picture: string | undefined | null;
}
export interface IMatch {
    id: number;
    nextMatchId: number | null;
    tournamentRoundText: string;
    startTime: string;
    state: string;
    participants: ITeam[];
}

const GlootTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#F4F2FE", dark: "#707582" },
    matchBackground: { wonColor: "#2D2D59", lostColor: "#1B1D2D" },
    score: {
        background: {
            wonColor: `#10131C`,
            lostColor: "#10131C",
        },
        text: {
            highlightedWonColor: "#7BF59D",
            highlightedLostColor: "#FB7E94",
        },
    },
    border: {
        color: "#292B43",
        highlightedColor: "RGBA(152,82,242,0.4)",
    },
    roundHeader: { backgroundColor: "#3B3F73", fontColor: "#F4F2FE" },
    connectorColor: "#3B3F73",
    connectorColorHighlight: "RGBA(152,82,242,0.4)",
    svgBackground: "#0F121C",
});

export const simpleSmallBracket: IMatch[] = [
    {
        id: 19753,
        nextMatchId: null,
        tournamentRoundText: "3",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [],
    },
    {
        id: 19754,
        nextMatchId: 19753,
        tournamentRoundText: "2",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [
            {
                id: "14754a1a-932c-4992-8dec-f7f94a339960",
                resultText: null,
                isWinner: false,
                status: null,
                name: "CoKe BoYz",
                picture: "teamlogos/client_team_default_logo",
            },
        ],
    },
    {
        id: 19755,
        nextMatchId: 19754,
        tournamentRoundText: "1",
        startTime: "2021-05-30",
        state: "SCORE_DONE",
        participants: [
            {
                id: "14754a1a-932c-4992-8dec-f7f94a339960",
                resultText: "Won",
                isWinner: true,
                status: "PLAYED",
                name: "CoKe BoYz",
                picture: "teamlogos/client_team_default_logo",
            },
            {
                id: "d16315d4-7f2d-427b-ae75-63a1ae82c0a8",
                resultText: "Lost",
                isWinner: false,
                status: "PLAYED",
                name: "Aids Team",
                picture: "teamlogos/client_team_default_logo",
            },
        ],
    },
    {
        id: 19756,
        nextMatchId: 19754,
        tournamentRoundText: "1",
        startTime: "2021-05-30",
        state: "RUNNING",
        participants: [
            {
                id: "d8b9f00a-0ffa-4527-8316-da701894768e",
                resultText: null,
                isWinner: false,
                status: null,
                name: "Art of kill",
                picture: "teamlogos/client_team_default_logo",
            },
        ],
    },
    {
        id: 19757,
        nextMatchId: 19753,
        tournamentRoundText: "2",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [],
    },
    {
        id: 19758,
        nextMatchId: 19757,
        tournamentRoundText: "1",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [
            {
                id: "9397971f-4b2f-44eb-a094-722eb286c59b",
                resultText: null,
                isWinner: false,
                status: null,
                name: "Crazy Pepes",
                picture: "teamlogos/client_team_default_logo",
            },
        ],
    },
    {
        id: 19759,
        nextMatchId: 19757,
        tournamentRoundText: "1",
        startTime: "2021-05-30",
        state: "SCHEDULED",
        participants: [
            {
                id: "42fecd89-dc83-4821-80d3-718acb50a30c",
                resultText: null,
                isWinner: false,
                status: null,
                name: "BLUEJAYS",
                picture: "teamlogos/client_team_default_logo",
            },
            {
                id: "df01fe2c-18db-4190-9f9e-aa63364128fe",
                resultText: null,
                isWinner: false,
                status: null,
                name: "Bosphorus",
                picture: "teamlogos/r7zn4gr8eajivapvjyzd",
            },
        ],
    },
];
export const Tournament = () => {
    const windowSize = useWindowSize();
    return (
        <SingleEliminationBracket
            theme={GlootTheme}
            matches={simpleSmallBracket}
            matchComponent={Match}
            svgWrapper={({ children, ...props }) => (
                <SVGViewer
                    width={windowSize.width}
                    height={windowSize.height}
                    background="rgb(11, 13, 19)"
                    SVGBackground="rgb(11, 13, 19)"
                    {...props}
                >
                    {children}
                </SVGViewer>
            )}
            onMatchClick={(match) => console.log(match)}
            onPartyClick={(match) => console.log(match)}
        />
    );
};

export default Tournament;

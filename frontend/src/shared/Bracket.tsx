import { ReactElement, useRef } from "react";
import { Match, Tournament } from "../helpers/transformMatches";
import { tournamentAPI } from "./rtk/tournamentAPI";
import { DraggableParent } from "./DraggableParent";
import DynamicBracketMatch from "./DynamicBracketMatch";
const sortMatchesForBracket = (matches: Match[] | undefined) => {
    if (!matches) {
        return [];
    }
    matches.sort((match1, match2) => {
        return Number(match1.name) - Number(match2.name);
    });
    let sortedMatches: Match[] = [];
    for (let i = Math.max(...matches.map((m) => Number(m.name))); i > 0; i--) {
        sortedMatches = sortedMatches.concat(
            matches
                .filter((m) => Number(m.name) === i)
                .sort((match1, match2) => {
                    if (!match1.next_match) {
                        return 1;
                    }
                    if (!match2.next_match) {
                        return -1;
                    }
                    return match1.next_match?.id - match2.next_match?.id;
                })
        );
    }

    return sortedMatches;
};
const Bracket = ({ tournament }: { tournament: Tournament }) => {
    const sortedMatches = sortMatchesForBracket(
        JSON.parse(JSON.stringify(tournament?.matches ?? false))
    );
    const bracketSize = {
        width: tournament?.max_rounds ? tournament.max_rounds * 500 + 150 : 0,
        height: tournament?.max_rounds
            ? 2 ** (tournament.max_rounds - 1) * 240
            : 0
    };
    const roundHeaders: ReactElement[] = [];
    for (let i = 0; i < tournament.max_rounds; i++) {
        roundHeaders.push(
            <div
                key={i}
                style={{
                    width: `${
                        (bracketSize.width - 150) / tournament.max_rounds - 150
                    }px`
                }}
                className="h-12 ml-[150px] flex items-center justify-center bg-black text-white text-lg font-semibold"
            >
                {i + 1 === tournament.max_rounds
                    ? "Финал"
                    : i + 1 === tournament.max_rounds - 1
                    ? "Полуфинал"
                    : `1/${2 ** (tournament.max_rounds - i - 1)} финала`}
            </div>
        );
    }
    return (
        <>
            <DraggableParent>
                <div className="max-w-full relative max-h-[1000px] scrollbar-thin scrollbar-thumb-white scrollbar-track-black scrollbar-corner-black scrollbar-thumb-rounded-[3px] overflow-scroll">
                    <div
                        style={{
                            width: `${bracketSize.width}px`
                        }}
                        className="flex sticky top-0 bg-black z-50"
                    >
                        {roundHeaders}
                    </div>
                    <div
                        className={`flex flex-col font-roboto gap-0 bg-black flex-wrap`}
                        style={{
                            width: `${bracketSize.width}px`,
                            height: `${bracketSize.height + 48}px`
                        }}
                    >
                        {sortedMatches.map((match) => {
                            const containerSize = {
                                width: bracketSize.width,
                                height:
                                    bracketSize.height /
                                    2 ** (Number(match.name) - 1)
                            };
                            const hasChildMatches = tournament.matches.some(
                                (otherMatch) =>
                                    otherMatch.next_match?.id === match.id
                            );
                            return (
                                <DynamicBracketMatch
                                    key={match.id}
                                    round={
                                        tournament.max_rounds -
                                        Number(match.name) +
                                        1
                                    }
                                    hasChildMatches={hasChildMatches}
                                    timeString={match.starts}
                                    matchId={match.id}
                                    size={containerSize}
                                    participants={[
                                        match.participants[0]
                                            ? {
                                                  teamId: match.participants[0]
                                                      .team.id,
                                                  name: match.participants[0]
                                                      .team.name,
                                                  status:
                                                      match.participants[0]
                                                          .status === "PLAYED"
                                                          ? match
                                                                .participants[0]
                                                                .is_winner
                                                              ? "WON"
                                                              : "LOST"
                                                          : "TBD"
                                              }
                                            : null,
                                        match.participants[1]
                                            ? {
                                                  teamId: match.participants[1]
                                                      .team.id,
                                                  name: match.participants[1]
                                                      .team.name,
                                                  status:
                                                      match.participants[1]
                                                          .status === "PLAYED"
                                                          ? match
                                                                .participants[1]
                                                                .is_winner
                                                              ? "WON"
                                                              : "LOST"
                                                          : "TBD"
                                              }
                                            : null
                                    ]}
                                />
                            );
                        })}
                    </div>
                </div>
            </DraggableParent>
        </>
    );
};

export default Bracket;

import { IMatch } from "../pages/Tournament";
export interface Root {
    name: string;
    prize: number;
    registration_opened: boolean;
    starts: string;
    active: boolean;
    played: boolean;
    matches: Match[];
    teams: string[];
}

export interface Match {
    id: number;
    state: string;
    round_text: string;
    starts: string;
    tournament: Tournament;
    participants: Participant[];
    next_match?: NextMatch;
    name: string;
}

export interface Tournament {
    id: number;
    name: string;
    prize: number;
    registration_opened: boolean;
    starts: string;
    active: boolean;
    played: boolean;
}

export interface Participant {
    id: number;
    status: any;
    is_winner: any;
    result_text: any;
    team: Team;
    match: Match2;
}

export interface Team {
    id: number;
    name: string;
    tournaments: number[];
}

export interface Match2 {
    id: number;
    name: string;
    round_text: string;
    state: string;
    starts: string;
    next_match: number;
    tournament: number;
    teams: number[];
}

export interface NextMatch {
    id: number;
    name: string;
    round_text: string;
    state: string;
    starts: string;
    next_match: any;
    tournament: Tournament2;
    teams: any[];
}

export interface Tournament2 {
    id: number;
    name: string;
    prize: number;
    registration_opened: boolean;
    starts: string;
    active: boolean;
    played: boolean;
}

export default function transformMatches(tournamentObject: Root):IMatch[] {
    
    const matches = tournamentObject.matches;
    const resultMatches = [];
    for (let match of matches) {
        
        const resultMatch: any = {};
        resultMatch.id = match.id;
        resultMatch.name = match.name;
        if (
            match.participants.length !== 0 &&
            Object.keys(match.participants[0]).length !== 0
        ) {
            resultMatch.nextMatchId = match.participants[0].match.next_match;
        } else {
            resultMatch.nextMatchId = null;
        }
        resultMatch.tournamentRoundText = match.round_text;
        const starts = new Date(match.starts)
        resultMatch.startTime = starts.toLocaleDateString().slice(0, -5 ) + ' ' + starts.toLocaleTimeString().slice(0, -3);
        resultMatch.state = match.state;
        resultMatch.participants = [];
        for (let p of match.participants) {
            let participant: any = {};
            participant.id = p.id;
            participant.resultText = p.result_text;
            participant.isWinner = p.is_winner;
            participant.status = p.status;
            participant.name = p.team.name;
            resultMatch.participants.push(participant);
        }
        resultMatches.push(resultMatch);
    }
    return resultMatches;
}

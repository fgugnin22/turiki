import { Player } from "../features/TeamPlayerList";
import { IMatch } from "../pages/Tournament";
export interface TournamentPlayer {
  team_id: number;
  id: number;
  name: string;
}
export interface Root {
  name: string;
  prize: number;
  starts: string;
  status: string;
  matches: Match[];
  teams: string[];
  max_rounds: number;
  players: TournamentPlayer[];
}
export interface Bans {
  id: number;
  previous_team: number;
  timestamps: string[];
  time_to_select_map: string;
  ban_log: ("AUTO" | "CAPTAIN")[];
  time_to_enter_lobby: string;
  time_results_locked: string;
  time_to_confirm_results: string;
  maps: (
    | "CHALET"
    | "BANK"
    | "BORDER"
    | "CLUBHOUSE"
    | "KAFE"
    | "OREGON"
    | "SKYSCRAPER"
    | "THEMEPARK"
    | "VILLA"
  )[];
}
export interface Match {
  first_result_claimed: string;
  time_to_enter_lobby: string;
  time_results_locked: string;
  time_to_confirm_results: string;
  started: string;
  bans?: Bans;
  lobby?: {
    id: number;
    chat: number;
  } | null;
  id: number;
  state: string;
  round_text: string;
  starts: string;
  tournament?: Tournament;
  participants: Participant[];
  next_match?: number | null;
  name: string;
}

export interface Tournament {
  id: number;
  name: string;
  prize: number;
  status: string;
  starts: string;
  max_rounds: number;
  matches: Match[];
  teams: Team[];
  players: TournamentPlayer[];
}

export interface Participant {
  id: number;
  status: any;
  is_winner: boolean;
  result_text: any;
  team: Team;
  match: Match2;
  in_lobby: boolean;
  res_image: string;
}

export interface Team {
  id: number;
  name: string;
  tournaments: number[];
  games: any[];
  players: Player[];
  image: string;
}
export interface Match2 {
  first_result_claimed: string;
  started: string;
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

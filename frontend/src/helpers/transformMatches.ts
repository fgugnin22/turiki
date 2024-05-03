import { Player } from "../features/TeamPlayerList";
import { ChatMessages } from "../shared";
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
    chats: ChatMessages[];
  } | null;
  id: number;
  state: string;
  round_text: string;
  starts: string;
  tournament?: number;
  participants: Participant[];
  next_match?: number | null;
  name: string;
  is_bo3: boolean;
  is_visible: boolean;
  bo3_order: number;
  current_map: string;
  is_next_match_a_map: boolean;
}

export interface Tournament {
  id: number;
  name: string;
  prize: number;
  starts: string;
  max_rounds: number;
  matches: Match[];
  teams: Team[];
  players: TournamentPlayer[];
  status:
    | "REGISTRATION_CLOSED_BEFORE_REG"
    | "REGISTRATION_OPENED"
    | "REGISTRATION_CLOSED_AFTER_REG"
    | "CHECK_IN"
    | "CHECK_IN_CLOSED"
    | "ACTIVE"
    | "PLAYED";
  time_to_check_in: string;
  reg_starts: string;
  max_players_in_team: number;
}

export interface Participant {
  id: number;
  status: any;
  is_winner: boolean;
  result_text: any;
  team: Team;
  match: Match;
  in_lobby: boolean;
  res_image: string;
}

export interface INotification {
  id: number;
  user_id: number;
  kind: string;
  content: any;
  is_read: boolean;
}

export interface Team {
  id: number;
  name: string;
  tournaments: number[];
  games: any[];
  players: Player[];
  image: string;
  is_open: boolean;
  description: string;
  is_join_confirmation_necessary: boolean;
  payment: {
    [key: string]: {
      id: number;
      is_confirmed: boolean;
    };
  };
}

export interface NextMatch {
  id: number;
  name: string;
  round_text: string;
  state: string;
  starts: string;
  next_match: any;
  teams: any[];
}

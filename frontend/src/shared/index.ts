export interface message {
  type: string;
  chat: number;
  content: string;
  created_at: string;
  id: number;
  user: string;
}
export interface ChatMessages {
  id: number;
  is_team: boolean;
  lobby_id: number;
  team_id: number | null;
  messages: message[];
}
export interface IChangeSelfTeamStatus {
  teamId: string | number;
  userId: number;
  userName: string;
}
export interface ICreateTeam {
  matches?: [];
  tournaments?: [];
  players: {
    name: string;
  }[];
  name: string;
}
export interface IUser {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  team: number;
  is_staff: boolean;
  game_name: string;
  image?: string;
  google_oauth2: boolean;
  team_status: "CAPTAIN" | "REJECTED" | "ACTIVE" | "MANAGER" | "PENDING" | null;
}
export interface IRegisterTeam {
  tournamentId: number;
  players: { id: number }[];
}

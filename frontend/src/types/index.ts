export interface message {
    chat:number;
    content:string;
    created_at:string;
    id:number;
    user:string;
}
export interface ChatMessages {
    id:number;
    messages: message[];
}
export interface IChangeSelfTeamStatus {
    teamId:string |number;
    userId:number;
    userName:string;
}
export interface ICreateTeam {
    matches?: [];
    tournaments?: [];
    players: {
        name:string;
    }[];
    name:string;
}
export interface IUser {
    id:number;
    email:string;
    name:string;
    is_active: Boolean;
    team:number;
    team_status: "CAPTAIN" | "REJECTED" | "ACTIVE" | "MANAGER" | null;
}
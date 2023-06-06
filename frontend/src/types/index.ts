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
// {
//     "id": 77,
//     "games": [],
//     "players": [
//         {
//             "team_status": "CAPTAIN",
//             "id": 14,
//             "name": "faggot.r6"
//         }
//     ],
//     "name": "faggots",
//     "next_member": "faggot.r6",
//     "tournaments": []
// }

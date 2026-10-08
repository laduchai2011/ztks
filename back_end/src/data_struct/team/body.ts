import { Team_Type_Type, Team_Member_Role_Type } from '.';

export interface Get_Teams_Body_Field {
    cursor?: string;
    limit: number;
    admin_account_id: string;
}

export interface Get_Team_Members_Body_Field {
    cursor?: string;
    limit: number;
    team_id: string;
}

export interface Create_Team_Body_Field {
    name: string;
    type: Team_Type_Type;
    admin_account_id: string;
}

export interface Add_Team_Member_Body_Field {
    team_id: string;
    account_id: string;
    admin_account_id: string;
    role: Team_Member_Role_Type;
}

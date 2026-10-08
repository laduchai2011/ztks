export enum Team_Type_Enum {
    SALE = 'sale',
    STORE = 'store',
}

export type Team_Type_Type = Team_Type_Enum.SALE | Team_Type_Enum.STORE;

export enum Team_Member_Role_Enum {
    LEADER = 'leader',
    MEMBER = 'member',
}

export type Team_Member_Role_Type = Team_Member_Role_Enum.LEADER | Team_Member_Role_Enum.MEMBER;

export interface Team_Field {
    id: string;
    name: string;
    type: Team_Type_Type;
    is_lock: boolean;
    is_delete: boolean;
    account_id: string;
    create_time: string;
}

export interface Cursor_Team_Field {
    items: Team_Field[];
    next_cursor: string | null;
}

export interface Team_Member_Field {
    id: string;
    team_id: string;
    account_id: string;
    role: Team_Member_Role_Type;
    is_lock: boolean;
    is_delete: boolean;
    create_time: string;
}

export interface Cursor_Team_Member_Field {
    items: Team_Member_Field[];
    next_cursor: string | null;
}

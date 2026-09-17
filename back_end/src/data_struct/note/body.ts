export interface Create_Note_Body_Field {
    note: string;
    chat_room_id: string;
    account_id: string;
}

export interface Get_Notes_Body_Field {
    page: number;
    size: number;
    offset: number;
    is_delete?: boolean;
    chat_room_id: string;
    account_id: string;
}

export interface Update_Note_Body_Field {
    id: string;
    note: string;
    account_id: string;
}

export interface Delete_Note_Body_Field {
    id: string;
    account_id: string;
}

export interface Chat_Room_Body_Field {
    user_id_by_app: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface User_Take_Room_To_Chat_Body_Field {
    user_id_by_app: string;
    zalo_oa_id: string;
}

export interface Get_Chat_Room_With_Id_Body_Field {
    id: string;
}

export interface Get_My_Chat_Rooms_Body_Field {
    page: number;
    size: number;
    account_id: string;
}

export interface Get_Chat_Room_Role_With_Crid_Aaid_Body_Field {
    authorized_account_id: string;
    chat_room_id: string;
}

export interface Get_All_Chat_Room_Role_With_Crid_Body_Field {
    chat_room_id: string;
}

export interface Get_Chat_Room_With_Zalo_Oa_Id_User_Id_By_App_Body_Field {
    zalo_oa_id: string;
    user_id_by_app: string;
}

export interface Update_Setup_Chat_Room_Role_Body_Field {
    id: string;
    back_ground_color: string;
    is_read: boolean;
    is_send: boolean;
    account_id: string; // để xác định người có quyền cập nhật
}

export interface Create_Chat_Room_Role_Body_Field {
    authorized_account_id: string;
    chat_room_id: string;
    account_id: string;
}

export interface Chat_Rooms_Mongo_Body_Field {
    limit: number;
    cursor: string | null;
    is_my: boolean;
    zalo_oa_id?: string;
    authorized_account_id?: string;
    is_read?: boolean;
    is_send?: boolean;
    account_id?: string;
}

export interface Change_Chat_Room_Master_Body_Field {
    chat_room_id: string;
    new_account_id: string;
    account_id: string;
}

export interface Create_Chat_Room_Phone_Body_Field {
    phone: string;
    chat_room_id: string;
    account_id: string;
}

export interface Get_Latest_Chat_Room_Phone_Body_Field {
    chat_room_id: string;
    account_id: string;
}

export interface Get_List_Chat_Room_Phones_Body_Field {
    chat_room_id: string;
    account_id: string;
}

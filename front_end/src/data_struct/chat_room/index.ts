export interface Chat_Room_Field {
    id: string;
    user_id_by_app: string;
    status: string;
    zalo_oa_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Chat_Room_Role_Field {
    id: string;
    authorized_account_id: string;
    back_ground_color: string | null;
    is_read: boolean;
    is_send: boolean;
    status: string;
    chat_room_id: string;
    account_id: string;
    update_time: string;
    create_time: string;
}

export interface Chat_Room_Role_Schema {
    authorized_account_id: string;
    is_read: boolean;
    is_send: boolean;
    chat_room_id: string;
    zalo_oa_id: string;
    account_id: string;
}

export interface Paged_Chat_Room_Field {
    items: Chat_Room_Field[];
    total_count: number;
}

export interface Paged_Chat_Room_Mongo_Field {
    items: Chat_Room_Role_Schema[];
    cursor: string | null;
}

export interface Chat_Room_Phone_Field {
    id: string;
    phone: string;
    chat_room_id: string;
    create_time: string;
}

export interface Paged_Chat_Room_Phone_Field {
    items: Chat_Room_Phone_Field[];
    total_count: number;
}

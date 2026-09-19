import { Zalo_App_Field, Zalo_Oa_Field } from '../zalo';
import { Hook_Data_Body_Field } from '../zalo/hook_data/body';

export interface MessageV1BodyField {
    cursor: string | null;
    size: number;
    chat_room_id: string;
}

export interface Create_Message_V1_Body_Field {
    zalo_app: Zalo_App_Field;
    zalo_oa: Zalo_Oa_Field;
    payload: Hook_Data_Body_Field;
    chat_room_id: string;
}

export interface All_New_Messages_Body_Field {
    chat_room_id: string;
    account_id: string;
}

export interface Del_New_Messages_Body_Field {
    chat_room_id: string;
    account_id: string;
}

export interface Video_Message_Body_Field {
    zalo_app_id: string;
    zalo_oa_id: string;
    chat_room_id: string;
    account_id: string;
    video_name: string;
    oa_id: string;
    user_id: string;
    user_id_by_app: string;
}

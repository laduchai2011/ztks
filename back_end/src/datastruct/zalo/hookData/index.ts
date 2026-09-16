import { Zalo_Event_Name_Enum } from "./common";

export interface Hook_Data_Schema<T = Zalo_Message_Type> {
    event_name: Zalo_Event_Name_Enum;
    app_id: string;
    oa_id: string;
    chat_room_id: number;
    user_id_by_app: string;
    sender_id: string;
    recipient_id: string;
    reply_account_id: number;
    message_id: string;
    message: T;
    is_seen: boolean;
    timestamp: Date;
}

export interface Hook_Data_Field<T = Zalo_Message_Type> {
    app_id: string;
    user_id_by_app: string;
    event_name: Zalo_Event_Name_Enum;
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    message: T;
    timestamp: string;
}

interface Message_Field {
    msg_id: string;
    text?: string;
}

export interface Message_Text_Field extends Message_Field {
    quote_msg_id?: string;
    msg_id: string;
    text: string;
}

export interface Message_Image_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                thumbnail: string;
                url: string;
            };
            type: 'image';
        },
    ];
}

export interface Message_Multi_Image_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                thumbnail: string;
                total_item_in_album: string;
                id_in_album: string;
                album_id: string;
                url: string;
            };
            type: 'multi_image';
        },
    ];
}

export interface Message_Video_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                thumbnail: string;
                description: string;
                url: string;
            };
            type: 'video';
        },
    ];
}

export interface Message_Audio_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                url: string;
            };
            type: 'audio';
        },
    ];
}

export interface Message_File_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                size: string;
                name: string;
                checksum: string;
                type: string;
                url: string;
            };
            type: 'file';
        },
    ];
}

export interface Message_Sticker_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                id: string;
                url: string;
            };
            type: 'sticker';
        },
    ];
}

export interface Message_Link_Field extends Message_Field {
    msg_id: string;
    attachments: [
        {
            payload: {
                thumbnail: string;
                description: string;
                title: string;
                url: string;
            };
            type: 'link';
        },
    ];
}

export type Zalo_Message_Type =
    | Message_Text_Field
    | Message_Image_Field
    | Message_Multi_Image_Field
    | Message_Video_Field
    | Message_Audio_Field
    | Message_File_Field
    | Message_Sticker_Field
    | Message_Link_Field;
// | Record<string, unknown>; // fallback

export interface Result_Send_To_Zalo_Field {
    data: {
        message_id: string;
        user_id: string;
        sent_time: number;
    };
    error: number;
    message: string;
}

export enum Hook_Call_Type_Enum {
    AUDIO = 'AUDIO',
}

export type Zalo_Call_Type = Hook_Call_Type_Enum.AUDIO;

export interface Hook_Call_Schema<T = Zalo_Call_Type> {
    event_name: Zalo_Event_Name_Enum;
    app_id: string;
    oa_id: string;
    chat_room_id: number;
    user_id_by_app: string;
    user_id: string;
    call_id: string;
    call_type: T;
    waiting_time: string;
    init_time: string;
    call_duration: string;
    talk_time: string;
    status_code: number;
    reply_account_id: number;
    is_seen: boolean;
    timestamp: Date;
}

export interface Hook_Call_Field<T = Zalo_Call_Type> {
    event_name: Zalo_Event_Name_Enum;
    app_id: string;
    oa_id: string;
    user_id_by_app: string;
    user_id: string;
    call_id: string;
    call_type: T;
    waiting_time: string;
    init_time: string;
    call_duration: string;
    talk_time: string;
    status_code: number;
    timestamp: string;
}

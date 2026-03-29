import { Zalo_Event_Name_Enum } from './common';

export interface HookDataSchema<T = ZaloMessageType> {
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

export interface HookDataField<T = ZaloMessageType> {
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

interface MessageField {
    msg_id: string;
    text?: string;
}

export interface MessageTextField extends MessageField {
    quote_msg_id?: string;
    msg_id: string;
    text: string;
}

export interface MessageImageField extends MessageField {
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

export interface MessageMultiImageField extends MessageField {
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

export interface MessageVideoField extends MessageField {
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

export interface MessageAudioField extends MessageField {
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

export interface MessageFileField extends MessageField {
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

export interface MessageStickerField extends MessageField {
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

export interface MessageLinkField extends MessageField {
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

export type ZaloMessageType =
    | MessageTextField
    | MessageImageField
    | MessageMultiImageField
    | MessageVideoField
    | MessageAudioField
    | MessageFileField
    | MessageStickerField
    | MessageLinkField;
// | Record<string, unknown>; // fallback

export interface ResultSendToZaloField {
    data: {
        message_id: string;
        user_id: string;
        sent_time: number;
    };
    error: number;
    message: string;
}

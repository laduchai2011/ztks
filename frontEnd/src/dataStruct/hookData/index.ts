export enum zalo_event_name_enum {
    user_send_text = 'user_send_text',
    user_send_image = 'user_send_image',
    user_send_video = 'user_send_video',
    oa_send_text = 'oa_send_text',
    oa_send_image = 'oa_send_image',
    user_received_message = 'user_received_message',
    user_seen_message = 'user_seen_message',
    member_sending = 'member_sending',
}

export enum zalo_event_name_enum_messageQueue {
    // user_send_text = 'user_send_text_dev',
    // user_send_image = 'user_send_image_dev',
    // user_send_video = 'user_send_video_dev',
    // oa_send_text = 'oa_send_text_dev',
    // oa_send_image = 'oa_send_image_dev',
    // user_received_message = 'user_received_message_dev',
    // user_seen_message = 'user_seen_message_dev',
    // member_sending = 'member_sending_dev',
    user_send_text = 'user_send_text',
    user_send_image = 'user_send_image',
    user_send_video = 'user_send_video',
    oa_send_text = 'oa_send_text',
    oa_send_image = 'oa_send_image',
    user_received_message = 'user_received_message',
    user_seen_message = 'user_seen_message',
    member_sending = 'member_sending',
}

type zalo_event_name_type =
    | zalo_event_name_enum.user_send_text
    | zalo_event_name_enum.user_send_image
    | zalo_event_name_enum.user_send_video
    | zalo_event_name_enum.oa_send_text
    | zalo_event_name_enum.oa_send_image
    | zalo_event_name_enum.user_received_message
    | zalo_event_name_enum.user_seen_message
    | zalo_event_name_enum.member_sending;

export interface HookDataField<Tdata = ZaloMessage> {
    app_id: string;
    user_id_by_app: string;
    event_name: zalo_event_name_type;
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    message: Tdata;
    timestamp: string;
}

export interface HookDataFieldToSend<Tdata = ZaloMessage> {
    recipient: {
        user_id: string;
    };
    message: Tdata;
}

export interface MessageTextField {
    text: string;
    msg_id: string;
}

export interface MessageImageField {
    text: string;
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: MessageImageUrlField[];
        };
    };
}

export interface MessageVideoField {
    text: string;
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: MessageVideoUrlField[];
        };
    };
}

export interface MessageImageUrlField {
    media_type: 'image';
    url: string;
}

export interface MessageVideoUrlField {
    media_type: 'video';
    url: string;
    thumbnail: string;
}

export interface MessageImageOaSendField {
    text: string;
    attachments: MessageImageUrlOaSendField[];
    msg_id: string;
}

export interface MessageImageUrlOaSendField {
    payload: {
        thumbnail: string;
        url: string;
    };
    type: 'image';
}

export interface MessageImagesField {
    text: string;
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: MessageImageUrlField[];
        };
    };
}

export interface MessageImageUrlField {
    media_type: 'image';
    url: string;
}

// export interface MessageImagesUSField {
//     attachments: MessageImagesUSAttachmentField[];
// }

// export interface MessageImagesUSAttachmentField {
//     payload: {
//         thumbnail: string;
//         url: string;
//     };
//     type: 'image';
// }

export type ZaloMessage =
    | MessageTextField
    | MessageImagesField
    | MessageImageField
    | MessageVideoField
    | MessageImageOaSendField
    | Record<string, unknown>; // fallback

export interface ZaloCustomerField {
    data: {
        avatar: string;
        avatars: {
            120: string;
            240: string;
        };
        display_name: string;
        dynamic_param: string;
        is_sensitive: boolean;
        shared_info: {
            address: string;
            city: string;
            district: string;
            name: string;
            phone: number;
            user_dob: string;
        };
        tags_and_notes_info: {
            notes: string[];
            tag_names: string[];
        };
        user_alias: string;
        user_external_id: string;
        user_id: string;
        user_id_by_app: string;
        user_is_follower: boolean;
        user_last_interaction_date: string;
        user_gender: string;
        tags: [];
    };
    error: number;
    message: string;
}

export interface MessageZaloField {
    data: any;
    isNewCustom: boolean;
    accountId: number;
}

export interface MessageVideosField {
    msg_id: string;
    text: string;
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

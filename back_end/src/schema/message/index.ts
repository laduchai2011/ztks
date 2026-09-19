import z from 'zod';
import {
    Message_Text_Schema,
    Message_Image_Schema,
    Message_Multi_Image_Schema,
    Message_Video_Schema,
    Message_Audio_Schema,
    Message_File_Schema,
    Message_Sticker_Schema,
    Message_Link_Schema,
    Call_Schema,
} from './message_type';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';

const Base_Event_Schema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.string(),
    user_id_by_app: z.string(),
    sender_id: z.string(),
    recipient_id: z.string(),
    reply_account_id: z.string(),
    is_seen: z.boolean(),
    message_id: z.string(),
    // timestamp: z.coerce.date(),
    timestamp: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
};

const Base_Call_Event_Schema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.string(),
    user_id_by_app: z.string(),
    user_id: z.string(),
    call_id: z.string(),
    waiting_time: z.string(),
    init_time: z.string(),
    call_duration: z.string(),
    talk_time: z.string(),
    status_code: z.number(),
    reply_account_id: z.string(),
    is_seen: z.boolean(),
    // timestamp: z.coerce.date(),
    timestamp: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
};

// const MessageTextZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_text), z.literal(Zalo_Event_Name_Enum.oa_send_text)]),
//     ...BaseEventSchema,
//     message: MessageTextSchema,
// });
const User_Message_Text_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_text),
    ...Base_Event_Schema,
    message: Message_Text_Schema,
});
const Oa_Message_Text_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_text),
    ...Base_Event_Schema,
    message: Message_Text_Schema,
});

// const MessageImageZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_image),
//         z.literal(Zalo_Event_Name_Enum.oa_send_image),
//     ]),
//     ...BaseEventSchema,
//     message: z.union([MessageImageSchema, MessageMultiImageSchema]),
// });
const User_Message_Image_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_image),
    ...Base_Event_Schema,
    message: z.union([Message_Image_Schema, Message_Multi_Image_Schema]),
});
const Oa_Message_Image_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_image),
    ...Base_Event_Schema,
    message: z.union([Message_Image_Schema, Message_Multi_Image_Schema]),
});

// const MessageVideoZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_video),
//         z.literal(Zalo_Event_Name_Enum.oa_send_video),
//     ]),
//     ...BaseEventSchema,
//     message: MessageVideoSchema,
// });
const User_Message_Video_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_video),
    ...Base_Event_Schema,
    message: Message_Video_Schema,
});
const Oa_Message_Video_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_video),
    ...Base_Event_Schema,
    message: Message_Video_Schema,
});

// const MessageAudioZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_audio),
//         z.literal(Zalo_Event_Name_Enum.oa_send_audio),
//     ]),
//     ...BaseEventSchema,
//     message: MessageAudioSchema,
// });
const User_Message_Audio_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_audio),
    ...Base_Event_Schema,
    message: Message_Audio_Schema,
});
const Oa_Message_Audio_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_audio),
    ...Base_Event_Schema,
    message: Message_Audio_Schema,
});

// const MessageFileZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_file), z.literal(Zalo_Event_Name_Enum.oa_send_file)]),
//     ...BaseEventSchema,
//     message: MessageFileSchema,
// });
const User_Message_File_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_file),
    ...Base_Event_Schema,
    message: Message_File_Schema,
});
const Oa_Message_File_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_file),
    ...Base_Event_Schema,
    message: Message_File_Schema,
});

// const MessageStickerZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_sticker),
//         z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
//     ]),
//     ...BaseEventSchema,
//     message: MessageStickerSchema,
// });
const User_Message_Sticker_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_sticker),
    ...Base_Event_Schema,
    message: Message_Sticker_Schema,
});
const Oa_Message_Sticker_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
    ...Base_Event_Schema,
    message: Message_Sticker_Schema,
});

// const MessageLinkZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_link), z.literal(Zalo_Event_Name_Enum.oa_send_link)]),
//     ...BaseEventSchema,
//     message: MessageLinkSchema,
// });
const User_Message_Link_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_link),
    ...Base_Event_Schema,
    message: Message_Link_Schema,
});
const Oa_Message_Link_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_link),
    ...Base_Event_Schema,
    message: Message_Link_Schema,
});

// const CallZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_call_oa), z.literal(Zalo_Event_Name_Enum.oa_call_user)]),
//     ...BaseCallEventSchema,
//     ...CallSchema,
// });
const User_Call_Oa_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_call_oa),
    ...Base_Call_Event_Schema,
    ...Call_Schema.shape,
});
const Oa_Call_User_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_call_user),
    ...Base_Call_Event_Schema,
    ...Call_Schema.shape,
});

export const Message_Zod_Schema = z.discriminatedUnion('event_name', [
    User_Message_Text_Zod_Schema,
    Oa_Message_Text_Zod_Schema,
    User_Message_Image_Zod_Schema,
    Oa_Message_Image_Zod_Schema,
    User_Message_Video_Zod_Schema,
    Oa_Message_Video_Zod_Schema,
    User_Message_Audio_Zod_Schema,
    Oa_Message_Audio_Zod_Schema,
    User_Message_File_Zod_Schema,
    Oa_Message_File_Zod_Schema,
    User_Message_Sticker_Zod_Schema,
    Oa_Message_Sticker_Zod_Schema,
    User_Message_Link_Zod_Schema,
    Oa_Message_Link_Zod_Schema,
]);
export const Call_Zod_Schema = z.discriminatedUnion('event_name', [User_Call_Oa_Zod_Schema, Oa_Call_User_Zod_Schema]);

export type Message_Schema_Type = z.infer<typeof Message_Zod_Schema> | z.infer<typeof Call_Zod_Schema>;

const Base1_Event_Schema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.string(),
    user_id_by_app: z.string(),
    sender_id: z.string(),
    recipient_id: z.string(),
    reply_account_id: z.string(),
    is_seen: z.boolean(),
    message_id: z.string(),
    // timestamp: z.coerce.date(),
    timestamp: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
    account_id: z.string(),
    created_at: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
};

const Base_Call1_Event_Schema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.string(),
    user_id_by_app: z.string(),
    user_id: z.string(),
    call_id: z.string(),
    waiting_time: z.string(),
    init_time: z.string(),
    call_duration: z.string(),
    talk_time: z.string(),
    status_code: z.number(),
    reply_account_id: z.string(),
    is_seen: z.boolean(),
    // timestamp: z.coerce.date(),
    timestamp: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
    account_id: z.string(),
    created_at: z.preprocess((val) => {
        if (val instanceof Date) return val;

        if (typeof val === 'string') {
            const s = val.trim();

            // unix seconds
            if (/^\d{10}$/.test(s)) return new Date(Number(s) * 1000);

            // unix milliseconds
            if (/^\d{13}$/.test(s)) return new Date(Number(s));

            // ISO or normal string
            return new Date(s);
        }

        if (typeof val === 'number') {
            // unix ms
            return new Date(val);
        }

        return val;
    }, z.date()),
};

// const NewMessageTextZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_text), z.literal(Zalo_Event_Name_Enum.oa_send_text)]),
//     ...Base1EventSchema,
//     message: MessageTextSchema,
// });
const New_User_Message_Text_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_text),
    ...Base1_Event_Schema,
    message: Message_Text_Schema,
});
const New_Oa_Message_Text_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_text),
    ...Base1_Event_Schema,
    message: Message_Text_Schema,
});

// const NewMessageImageZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_image),
//         z.literal(Zalo_Event_Name_Enum.oa_send_image),
//     ]),
//     ...Base1EventSchema,
//     message: z.union([MessageImageSchema, MessageMultiImageSchema]),
// });
const New_User_Message_Image_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_image),
    ...Base1_Event_Schema,
    message: z.union([Message_Image_Schema, Message_Multi_Image_Schema]),
});
const New_Oa_Message_Image_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_image),
    ...Base1_Event_Schema,
    message: z.union([Message_Image_Schema, Message_Multi_Image_Schema]),
});

// const NewMessageVideoZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_video),
//         z.literal(Zalo_Event_Name_Enum.oa_send_video),
//     ]),
//     ...Base1EventSchema,
//     message: MessageVideoSchema,
// });
const New_User_Message_Video_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_video),
    ...Base1_Event_Schema,
    message: Message_Video_Schema,
});
const New_Oa_Message_Video_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_video),
    ...Base1_Event_Schema,
    message: Message_Video_Schema,
});

// const NewMessageAudioZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_audio),
//         z.literal(Zalo_Event_Name_Enum.oa_send_audio),
//     ]),
//     ...Base1EventSchema,
//     message: MessageAudioSchema,
// });
const New_User_Message_Audio_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_audio),
    ...Base1_Event_Schema,
    message: Message_Audio_Schema,
});
const New_Oa_Message_Audio_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_audio),
    ...Base1_Event_Schema,
    message: Message_Audio_Schema,
});

// const NewMessageFileZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_file), z.literal(Zalo_Event_Name_Enum.oa_send_file)]),
//     ...Base1EventSchema,
//     message: MessageFileSchema,
// });
const New_User_Message_File_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_file),
    ...Base1_Event_Schema,
    message: Message_File_Schema,
});
const New_Oa_Message_File_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_file),
    ...Base1_Event_Schema,
    message: Message_File_Schema,
});

// const NewMessageStickerZodSchema = z.object({
//     event_name: z.union([
//         z.literal(Zalo_Event_Name_Enum.user_send_sticker),
//         z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
//     ]),
//     ...Base1EventSchema,
//     message: MessageStickerSchema,
// });
const New_User_Message_Sticker_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_sticker),
    ...Base1_Event_Schema,
    message: Message_Sticker_Schema,
});
const New_Oa_Message_Sticker_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
    ...Base1_Event_Schema,
    message: Message_Sticker_Schema,
});

// const NewMessageLinkZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_link), z.literal(Zalo_Event_Name_Enum.oa_send_link)]),
//     ...Base1EventSchema,
//     message: MessageLinkSchema,
// });
const New_User_Message_Link_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_send_link),
    ...Base1_Event_Schema,
    message: Message_Link_Schema,
});
const New_Oa_Message_Link_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_send_link),
    ...Base1_Event_Schema,
    message: Message_Link_Schema,
});

// const NewCallZodSchema = z.object({
//     event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_call_oa), z.literal(Zalo_Event_Name_Enum.oa_call_user)]),
//     ...BaseCall1EventSchema,
//     ...CallSchema,
// });
const New_User_Call_Oa_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.user_call_oa),
    ...Base_Call1_Event_Schema,
    ...Call_Schema.shape,
});
const New_Oa_Call_User_Zod_Schema = z.object({
    event_name: z.literal(Zalo_Event_Name_Enum.oa_call_user),
    ...Base_Call1_Event_Schema,
    ...Call_Schema.shape,
});

export const New_Message_Zod_Schema = z.discriminatedUnion('event_name', [
    New_User_Message_Text_Zod_Schema,
    New_Oa_Message_Text_Zod_Schema,
    New_User_Message_Image_Zod_Schema,
    New_Oa_Message_Image_Zod_Schema,
    New_User_Message_Video_Zod_Schema,
    New_Oa_Message_Video_Zod_Schema,
    New_User_Message_Audio_Zod_Schema,
    New_Oa_Message_Audio_Zod_Schema,
    New_User_Message_File_Zod_Schema,
    New_Oa_Message_File_Zod_Schema,
    New_User_Message_Sticker_Zod_Schema,
    New_Oa_Message_Sticker_Zod_Schema,
    New_User_Message_Link_Zod_Schema,
    New_Oa_Message_Link_Zod_Schema,
]);
export const New_Call_Zod_Schema = z.discriminatedUnion('event_name', [
    New_User_Call_Oa_Zod_Schema,
    New_Oa_Call_User_Zod_Schema,
]);

export type New_Message_Schema_Type = z.infer<typeof New_Message_Zod_Schema> | z.infer<typeof New_Call_Zod_Schema>;

// helper
function normalize_To_UTC_Start_Of_Day(d: Date) {
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
export function get_Date_Key_VN(date: Date) {
    const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vn.toISOString().slice(0, 10);
}
export const Message_Amount_In_Day_Schema = z.object({
    amount: z.number().int(),
    account_id: z.string(),

    // ✅ thêm field này (QUAN TRỌNG)
    date_key: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    // ✅ normalize timestamp
    timestamp: z.preprocess((val) => {
        let d: Date;

        if (val instanceof Date) d = val;
        else if (typeof val === 'string' || typeof val === 'number') d = new Date(val);
        else return val;

        return normalize_To_UTC_Start_Of_Day(d);
    }, z.date()),
});

export type Message_Amount_In_Day_Type = z.infer<typeof Message_Amount_In_Day_Schema>;

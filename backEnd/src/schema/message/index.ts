import z from 'zod';
import {
    MessageTextSchema,
    MessageImageSchema,
    MessageMultiImageSchema,
    MessageVideoSchema,
    MessageAudioSchema,
    MessageFileSchema,
    MessageStickerSchema,
    MessageLinkSchema,
} from './messageType';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';

const BaseEventSchema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.number().int(),
    user_id_by_app: z.string(),
    sender_id: z.string(),
    recipient_id: z.string(),
    reply_account_id: z.number().int(),
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

const MessageTextZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_text), z.literal(Zalo_Event_Name_Enum.oa_send_text)]),
    ...BaseEventSchema,
    message: MessageTextSchema,
});

const MessageImageZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_image),
        z.literal(Zalo_Event_Name_Enum.oa_send_image),
    ]),
    ...BaseEventSchema,
    message: z.union([MessageImageSchema, MessageMultiImageSchema]),
});

const MessageVideoZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_video),
        z.literal(Zalo_Event_Name_Enum.oa_send_video),
    ]),
    ...BaseEventSchema,
    message: MessageVideoSchema,
});

const MessageAudioZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_audio),
        z.literal(Zalo_Event_Name_Enum.oa_send_audio),
    ]),
    ...BaseEventSchema,
    message: MessageAudioSchema,
});

const MessageFileZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_file), z.literal(Zalo_Event_Name_Enum.oa_send_file)]),
    ...BaseEventSchema,
    message: MessageFileSchema,
});

const MessageStickerZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_sticker),
        z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
    ]),
    ...BaseEventSchema,
    message: MessageStickerSchema,
});

const MessageLinkZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_link), z.literal(Zalo_Event_Name_Enum.oa_send_link)]),
    ...BaseEventSchema,
    message: MessageLinkSchema,
});

export const MessageZodSchema = z.discriminatedUnion('event_name', [
    MessageTextZodSchema,
    MessageImageZodSchema,
    MessageVideoZodSchema,
    MessageAudioZodSchema,
    MessageFileZodSchema,
    MessageStickerZodSchema,
    MessageLinkZodSchema,
]);

export type MessageSchemaType = z.infer<typeof MessageZodSchema>;

const Base1EventSchema = {
    app_id: z.string(),
    oa_id: z.string(),
    chat_room_id: z.number().int(),
    user_id_by_app: z.string(),
    sender_id: z.string(),
    recipient_id: z.string(),
    reply_account_id: z.number().int(),
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
    account_id: z.number().int(),
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

const NewMessageTextZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_text), z.literal(Zalo_Event_Name_Enum.oa_send_text)]),
    ...Base1EventSchema,
    message: MessageTextSchema,
});

const NewMessageImageZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_image),
        z.literal(Zalo_Event_Name_Enum.oa_send_image),
    ]),
    ...Base1EventSchema,
    message: z.union([MessageImageSchema, MessageMultiImageSchema]),
});

const NewMessageVideoZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_video),
        z.literal(Zalo_Event_Name_Enum.oa_send_video),
    ]),
    ...Base1EventSchema,
    message: MessageVideoSchema,
});

const NewMessageAudioZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_audio),
        z.literal(Zalo_Event_Name_Enum.oa_send_audio),
    ]),
    ...Base1EventSchema,
    message: MessageAudioSchema,
});

const NewMessageFileZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_file), z.literal(Zalo_Event_Name_Enum.oa_send_file)]),
    ...Base1EventSchema,
    message: MessageFileSchema,
});

const NewMessageStickerZodSchema = z.object({
    event_name: z.union([
        z.literal(Zalo_Event_Name_Enum.user_send_sticker),
        z.literal(Zalo_Event_Name_Enum.oa_send_sticker),
    ]),
    ...Base1EventSchema,
    message: MessageStickerSchema,
});

const NewMessageLinkZodSchema = z.object({
    event_name: z.union([z.literal(Zalo_Event_Name_Enum.user_send_link), z.literal(Zalo_Event_Name_Enum.oa_send_link)]),
    ...Base1EventSchema,
    message: MessageLinkSchema,
});

export const NewMessageZodSchema = z.discriminatedUnion('event_name', [
    NewMessageTextZodSchema,
    NewMessageImageZodSchema,
    NewMessageVideoZodSchema,
    NewMessageAudioZodSchema,
    NewMessageFileZodSchema,
    NewMessageStickerZodSchema,
    NewMessageLinkZodSchema,
]);

export type NewMessageSchemaType = z.infer<typeof NewMessageZodSchema>;

// helper
function normalizeToUTCStartOfDay(d: Date) {
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
export function getDateKeyVN(date: Date) {
    const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vn.toISOString().slice(0, 10);
}
export const MessageAmountInDaySchema = z.object({
    amount: z.number().int(),
    account_id: z.number().int(),

    // ✅ thêm field này (QUAN TRỌNG)
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    // ✅ normalize timestamp
    timestamp: z.preprocess((val) => {
        let d: Date;

        if (val instanceof Date) d = val;
        else if (typeof val === 'string' || typeof val === 'number') d = new Date(val);
        else return val;

        return normalizeToUTCStartOfDay(d);
    }, z.date()),
});

export type MessageAmountInDayType = z.infer<typeof MessageAmountInDaySchema>;

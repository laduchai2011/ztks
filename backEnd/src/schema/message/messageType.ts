import { z } from 'zod';

export const MessageTextSchema = z.object({
    msg_id: z.string(),
    text: z.string(),
    quote_msg_id: z.string().optional(),
});

export const MessageImageSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                thumbnail: z.string(),
                url: z.string(),
            }),
            type: z.literal('image'),
        })
    ),
});

export const MessageMultiImageSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                thumbnail: z.string(),
                total_item_in_album: z.string(),
                id_in_album: z.string(),
                album_id: z.string(),
                url: z.string(),
            }),
            type: z.literal('multi_image'),
        })
    ),
});

export const MessageVideoSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                thumbnail: z.string(),
                description: z.string(),
                url: z.string(),
            }),
            type: z.literal('video'),
        })
    ),
});

export const MessageAudioSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                url: z.string(),
            }),
            type: z.literal('audio'),
        })
    ),
});

export const MessageFileSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                size: z.string(),
                name: z.string(),
                checksum: z.string(),
                type: z.string(),
                url: z.string(),
            }),
            type: z.literal('file'),
        })
    ),
});

export const MessageStickerSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                id: z.string(),
                url: z.string(),
            }),
            type: z.literal('sticker'),
        })
    ),
});

export const MessageLinkSchema = z.object({
    msg_id: z.string(),
    text: z.string().optional(),
    attachments: z.array(
        z.object({
            payload: z.object({
                thumbnail: z.string(),
                description: z.string(),
                title: z.string(),
                url: z.string(),
            }),
            type: z.literal('link'),
        })
    ),
});

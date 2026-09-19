import { z } from 'zod';

export const Message_Text_Schema = z.object({
    msg_id: z.string(),
    text: z.string(),
    quote_msg_id: z.string().optional(),
});

export const Message_Image_Schema = z.object({
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

export const Message_Multi_Image_Schema = z.object({
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

export const Message_Video_Schema = z.object({
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

export const Message_Audio_Schema = z.object({
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

export const Message_File_Schema = z.object({
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

export const Message_Sticker_Schema = z.object({
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

export const Message_Link_Schema = z.object({
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

export const Call_Schema = z.object({
    call_type: z.literal('AUDIO'),
});

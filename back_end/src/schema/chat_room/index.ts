import z from 'zod';

export const Chat_Room_Role_Zod_Schema = z.object({
    authorized_account_id: z.string(),
    is_read: z.boolean(),
    is_send: z.boolean(),
    chat_room_id: z.string(),
    zalo_oa_id: z.string(),
    account_id: z.string(),
});

export type Chat_Room_Role_Schema_Type = z.infer<typeof Chat_Room_Role_Zod_Schema>;

import z from 'zod';

export const Chat_Room_Role_Zod_Schema = z.object({
    authorized_account_id: z.number().int(),
    is_read: z.boolean(),
    is_send: z.boolean(),
    chat_room_id: z.number().int(),
    zalo_oa_id: z.number().int(),
    account_id: z.number().int(),
});

export type Chat_Room_Role_Schema_Type = z.infer<typeof Chat_Room_Role_Zod_Schema>;

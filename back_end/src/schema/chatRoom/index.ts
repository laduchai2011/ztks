import z from 'zod';

export const ChatRoomRoleZodSchema = z.object({
    authorized_account_id: z.number().int(),
    is_read: z.boolean(),
    is_send: z.boolean(),
    chat_room_id: z.number().int(),
    zalo_oa_id: z.number().int(),
    account_id: z.number().int(),
});

export type ChatRoomRoleSchemaType = z.infer<typeof ChatRoomRoleZodSchema>;

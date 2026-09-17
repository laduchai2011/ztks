import { get_Db_Monggo } from '@src/connect/mongo';
import { Chat_Room_Role_Schema, Paged_Chat_Room_Mongo_Field } from '@src/datastruct/chat_room';
import { Chat_Rooms_Mongo_Body_Field } from '@src/datastruct/chat_room/body';

export async function get_Chat_Rooms_Mongo(chat_rooms_mongo_body: Chat_Rooms_Mongo_Body_Field): Promise<Paged_Chat_Room_Mongo_Field> {
    const db = get_Db_Monggo();
    const col = db.collection<Chat_Room_Role_Schema>('chat_room_role');

    const { limit, cursor, is_my, authorized_account_id, is_read, is_send, zalo_oa_id, account_id } = chat_rooms_mongo_body;

    // const authorized_account_id = authorizedAccountId;
    // const is_read = isRead;
    // const is_send = isSend;
    // const zalo_oa_id = zaloOaId;
    // const account_id = accountId;

    // ✅ Build match động
    const match = {
        ...(authorized_account_id !== undefined && { authorized_account_id }),
        ...(is_read !== undefined && { is_read }),
        ...(is_send !== undefined && { is_send }),
        ...(zalo_oa_id !== undefined && { zalo_oa_id }),
        ...(account_id !== undefined && { account_id }),
    };

    const cursor_date = cursor ? new Date(cursor) : undefined;

    const expr_condition = is_my
        ? { $eq: ['$authorized_account_id', '$account_id'] }
        : { $ne: ['$authorized_account_id', '$account_id'] };

    const pipeline: any[] = [
        {
            $match: {
                ...match,
                $expr: expr_condition,
            },
        },

        {
            $lookup: {
                from: 'last_message',
                local_field: 'chat_room_id',
                foreign_field: 'chat_room_id',
                as: 'last_message',
            },
        },

        { $unwind: '$last_message' },

        // 👇 cursor phân trang
        ...(cursor_date
            ? [
                  {
                      $match: {
                          'last_message.timestamp': { $lt: cursor_date },
                      },
                  },
              ]
            : []),

        { $sort: { 'last_message.timestamp': -1 } },

        { $limit: limit },

        // 🔹 bỏ lastMessage khỏi kết quả
        // {
        //     $project: {
        //         lastMessage: 0,
        //     },
        // },
    ];

    const data = await col.aggregate(pipeline).toArray();

    // data.reverse();

    const next_cursor = data.length > 0 ? data[data.length - 1].last_message.timestamp.toISOString() : null;

    const items = data.map(({ last_message, ...rest }) => rest) as Chat_Room_Role_Schema[];

    return { items, cursor: next_cursor };
}

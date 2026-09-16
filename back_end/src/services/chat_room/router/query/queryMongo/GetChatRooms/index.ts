import { getDbMonggo } from '@src/connect/mongo';
import { ChatRoomRoleSchema, PagedChatRoomMongoField } from '@src/dataStruct/chatRoom';
import { ChatRoomsMongoBodyField } from '@src/dataStruct/chatRoom/body';

export async function getChatRoomsMongo(chatRoomsMongoBody: ChatRoomsMongoBodyField): Promise<PagedChatRoomMongoField> {
    const db = getDbMonggo();
    const col = db.collection<ChatRoomRoleSchema>('chatRoomRole');
    // const col = db.collection<ChatRoomRoleSchema>('lastMessage');

    const { limit, cursor, isMy, authorizedAccountId, isRead, isSend, zaloOaId, accountId } = chatRoomsMongoBody;

    const authorized_account_id = authorizedAccountId;
    const is_read = isRead;
    const is_send = isSend;
    const zalo_oa_id = zaloOaId;
    const account_id = accountId;

    // ✅ Build match động
    const match = {
        ...(authorized_account_id !== undefined && { authorized_account_id }),
        ...(is_read !== undefined && { is_read }),
        ...(is_send !== undefined && { is_send }),
        ...(zalo_oa_id !== undefined && { zalo_oa_id }),
        ...(account_id !== undefined && { account_id }),
    };

    const cursorDate = cursor ? new Date(cursor) : undefined;

    const exprCondition = isMy
        ? { $eq: ['$authorized_account_id', '$account_id'] }
        : { $ne: ['$authorized_account_id', '$account_id'] };

    const pipeline: any[] = [
        {
            $match: {
                ...match,
                $expr: exprCondition,
            },
        },

        {
            $lookup: {
                from: 'lastMessage',
                localField: 'chat_room_id',
                foreignField: 'chat_room_id',
                as: 'lastMessage',
            },
        },

        { $unwind: '$lastMessage' },

        // 👇 cursor phân trang
        ...(cursorDate
            ? [
                  {
                      $match: {
                          'lastMessage.timestamp': { $lt: cursorDate },
                      },
                  },
              ]
            : []),

        { $sort: { 'lastMessage.timestamp': -1 } },

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

    const nextCursor = data.length > 0 ? data[data.length - 1].lastMessage.timestamp.toISOString() : null;

    const items = data.map(({ lastMessage, ...rest }) => rest) as ChatRoomRoleSchema[];

    return { items, cursor: nextCursor };
}

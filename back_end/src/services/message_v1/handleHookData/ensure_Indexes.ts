import { get_Db_Monggo } from '@src/connect/mongo';

export async function ensure_Indexes() {
    const db = get_Db_Monggo();

    const col_message = db.collection('message');
    await col_message.createIndex({ chat_room_id: 1, timestamp: -1 });
    await col_message.createIndex(
        { chat_room_id: 1, message_id: 1 },
        {
            unique: true,
            partialFilterExpression: {
                message_id: { $type: 'string' },
            },
        }
    );
    await col_message.createIndex(
        { chat_room_id: 1, call_id: 1 },
        {
            unique: true,
            partialFilterExpression: {
                call_id: { $type: 'string' },
            },
        }
    );

    const col_lastMessage = db.collection('last_message');
    await col_lastMessage.createIndex({ chat_room_id: 1 }, { unique: true });
    await col_lastMessage.createIndex({ recipient_id: -1 });
    await col_lastMessage.createIndex({ sender_id: -1 });
    await col_lastMessage.createIndex({ timestamp: -1 });

    const col_chatRoomRole = db.collection('chat_room_role');
    await col_chatRoomRole.createIndex({ authorized_account_id: 1 });
    await col_chatRoomRole.createIndex({ chat_room_id: 1 });
    await col_chatRoomRole.createIndex({ zalo_oa_id: 1 });
    await col_chatRoomRole.createIndex({ account_id: 1 });
    await col_chatRoomRole.createIndex({ chat_room_id: 1, authorized_account_id: 1 }, { unique: true });

    const col_newMessage = db.collection('new_message');
    await col_newMessage.createIndex({ chat_room_id: 1, account_id: 1, message_id: 1 }, { unique: true });
    await col_newMessage.createIndex({ created_at: 1 }, { expireAfterSeconds: 3600 * 24 * 15 });

    const col_messageAmountInDay = db.collection('message_amount_in_day');
    await col_messageAmountInDay.createIndex({ account_id: 1, dateKey: 1 }, { unique: true });

    const col_waitVideoMessage = db.collection('wait_video_message');
    await col_waitVideoMessage.createIndex({ reply_account_id: 1 }, { unique: true });
    await col_waitVideoMessage.createIndex({ timestamp: 1 }, { expireAfterSeconds: 60 });
}

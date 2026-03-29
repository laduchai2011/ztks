import { getDbMonggo } from '@src/connect/mongo';
import { NewMessageV1Field } from '@src/dataStruct/message_v1';
import { DelNewMessagesBodyField } from '@src/dataStruct/message_v1/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

export async function delAllNewMessages(delNewMessagesBody: DelNewMessagesBodyField) {
    const db = getDbMonggo();
    const col = db.collection<NewMessageV1Field<ZaloMessageType>>('newMessage');

    const data = await col.deleteMany({
        chat_room_id: delNewMessagesBody.chatRoomId,
        account_id: delNewMessagesBody.accountId,
    });

    return data;
}

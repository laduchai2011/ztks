import { getDbMonggo } from '@src/connect/mongo';
import { NewMessageV1Field } from '@src/dataStruct/message_v1';
import { AllNewMessagesBodyField } from '@src/dataStruct/message_v1/body';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

export async function getAllNewMessages(
    allNewMessagesBody: AllNewMessagesBodyField
): Promise<NewMessageV1Field<ZaloMessageType>[] | undefined> {
    const db = getDbMonggo();
    const col = db.collection<NewMessageV1Field<ZaloMessageType>>('newMessage');

    const data = await col
        .find<NewMessageV1Field<ZaloMessageType>>(
            { chat_room_id: allNewMessagesBody.chatRoomId, account_id: allNewMessagesBody.accountId },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .toArray();

    return data;
}

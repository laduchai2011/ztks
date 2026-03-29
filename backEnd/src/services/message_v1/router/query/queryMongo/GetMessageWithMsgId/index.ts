import { getDbMonggo } from '@src/connect/mongo';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

export async function getMessageWithMsgId(
    chat_room_id: number,
    msg_id: string
): Promise<MessageV1Field<ZaloMessageType> | undefined> {
    const db = getDbMonggo();
    const col = db.collection<MessageV1Field<ZaloMessageType>>('message');

    const data = await col
        .find<MessageV1Field<ZaloMessageType>>(
            { chat_room_id: chat_room_id, message_id: msg_id },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    return data.length > 0 ? data[0] : undefined;
}

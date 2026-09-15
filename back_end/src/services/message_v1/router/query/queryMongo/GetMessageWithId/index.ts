import { ObjectId } from 'mongodb';
import { getDbMonggo } from '@src/connect/mongo';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType } from '@src/dataStruct/zalo/hookData';

export async function getMessageWithId(id: string): Promise<MessageV1Field<ZaloMessageType> | undefined> {
    const db = getDbMonggo();
    const col = db.collection<MessageV1Field<ZaloMessageType>>('message');

    const objId = new ObjectId(id);

    const data = await col
        .find<MessageV1Field<ZaloMessageType>>({ _id: objId }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    return data.length > 0 ? data[0] : undefined;
}

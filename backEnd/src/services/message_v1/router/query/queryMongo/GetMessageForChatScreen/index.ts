import { getDbMonggo } from '@src/connect/mongo';
import { MessageV1Field, CallV1Field, PagedMessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType, ZaloCallType } from '@src/dataStruct/zalo/hookData';

export async function getMessagesFirst(
    chat_room_id: number,
    limit: number
): Promise<PagedMessageV1Field<ZaloMessageType, ZaloCallType>> {
    const db = getDbMonggo();
    const col = db.collection<MessageV1Field<ZaloMessageType> | CallV1Field<ZaloCallType>>('message');

    const data = await col
        .find<MessageV1Field<ZaloMessageType> | CallV1Field<ZaloCallType>>({ chat_room_id }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    // const count = await col.countDocuments();

    data.reverse();

    const nextCursor = data.length ? data[0].timestamp.toISOString() : null;

    return { items: data, cursor: nextCursor };
}

export async function getMessagesMore(
    chat_room_id: number,
    cursor: string,
    limit: number
): Promise<PagedMessageV1Field<ZaloMessageType, ZaloCallType>> {
    const db = getDbMonggo();
    const col = db.collection<MessageV1Field<ZaloMessageType>>('message');

    const cursorDate = new Date(cursor);

    const data = await col
        .find(
            {
                chat_room_id,
                timestamp: { $lt: cursorDate }, // 👈 lấy tin cũ hơn
            },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

    data.reverse();

    const nextCursor = data.length ? data[0].timestamp.toISOString() : null;

    return { items: data, cursor: nextCursor };
}

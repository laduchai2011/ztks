import { get_Db_Monggo } from '@src/connect/mongo';
import { Message_V1_Field, Call_V1_Field, Paged_Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Zalo_Call_Type } from '@src/data_struct/zalo/hook_data';

export async function get_Messages_First(
    chat_room_id: string,
    limit: number
): Promise<Paged_Message_V1_Field<Zalo_Message_Type, Zalo_Call_Type>> {
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>>('message');

    const data = await col
        .find<Message_V1_Field<Zalo_Message_Type> | Call_V1_Field<Zalo_Call_Type>>(
            { chat_room_id },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    // const count = await col.countDocuments();

    data.reverse();

    const next_cursor = data.length ? data[0].timestamp.toISOString() : null;

    return { items: data, cursor: next_cursor };
}

export async function get_Messages_More(
    chat_room_id: string,
    cursor: string,
    limit: number
): Promise<Paged_Message_V1_Field<Zalo_Message_Type, Zalo_Call_Type>> {
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Zalo_Message_Type>>('message');

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

    const next_cursor = data.length ? data[0].timestamp.toISOString() : null;

    return { items: data, cursor: next_cursor };
}

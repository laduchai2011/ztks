import { get_Db_Monggo } from '@src/connect/mongo';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';

export async function get_Last_Message(chat_room_id: string): Promise<Message_V1_Field<Zalo_Message_Type> | undefined> {
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Zalo_Message_Type>>('last_message');

    const data = await col
        .find<Message_V1_Field<Zalo_Message_Type>>({ chat_room_id }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    return data.length > 0 ? data[0] : undefined;
}

export async function get_Last_Message_With_Uid(uid: string): Promise<Message_V1_Field<Zalo_Message_Type> | undefined> {
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Zalo_Message_Type>>('last_message');

    const data = await col
        .find<Message_V1_Field<Zalo_Message_Type>>(
            {
                $or: [{ recipient_id: uid }, { sender_id: uid }],
            },
            {
                projection: { _id: 0 },
            }
        )
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    return data.length > 0 ? data[0] : undefined;
}

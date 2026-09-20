import { get_Db_Monggo } from '@src/connect/mongo';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';

export async function get_Message_With_Msg_Id(
    chat_room_id: string,
    msg_id: string
): Promise<Message_V1_Field<Zalo_Message_Type> | undefined> {
    const db = get_Db_Monggo();
    const col = db.collection<Message_V1_Field<Zalo_Message_Type>>('message');

    const data = await col
        .find<Message_V1_Field<Zalo_Message_Type>>(
            { chat_room_id: chat_room_id, message_id: msg_id },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    return data.length > 0 ? data[0] : undefined;
}

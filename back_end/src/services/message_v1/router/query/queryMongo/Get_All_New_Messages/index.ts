import { get_Db_Monggo } from '@src/connect/mongo';
import { New_Message_V1_Field } from '@src/data_struct/message_v1';
import { All_New_Messages_Body_Field } from '@src/data_struct/message_v1/body';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';

export async function get_All_New_Messages(
    all_new_messages_body: All_New_Messages_Body_Field
): Promise<New_Message_V1_Field<Zalo_Message_Type>[] | undefined> {
    const db = get_Db_Monggo();
    const col = db.collection<New_Message_V1_Field<Zalo_Message_Type>>('new_message');

    const data = await col
        .find<New_Message_V1_Field<Zalo_Message_Type>>(
            { chat_room_id: all_new_messages_body.chat_room_id, account_id: all_new_messages_body.account_id },
            { projection: { _id: 0 } }
        )
        .sort({ timestamp: -1 })
        .toArray();

    return data;
}

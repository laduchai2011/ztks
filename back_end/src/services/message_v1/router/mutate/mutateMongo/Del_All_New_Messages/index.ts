import { get_Db_Monggo } from '@src/connect/mongo';
import { New_Message_V1_Field } from '@src/data_struct/message_v1';
import { Del_New_Messages_Body_Field } from '@src/data_struct/message_v1/body';
import { Zalo_Message_Type } from '@src/data_struct/zalo/hook_data';

export async function del_All_New_Messages(del_new_messages_body: Del_New_Messages_Body_Field) {
    const db = get_Db_Monggo();
    const col = db.collection<New_Message_V1_Field<Zalo_Message_Type>>('new_message');

    const data = await col.deleteMany({
        chat_room_id: del_new_messages_body.chat_room_id,
        account_id: del_new_messages_body.account_id,
    });

    return data;
}

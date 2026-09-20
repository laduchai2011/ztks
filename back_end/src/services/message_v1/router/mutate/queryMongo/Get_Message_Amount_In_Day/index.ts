import { get_Db_Monggo } from '@src/connect/mongo';
import { Message_Amount_In_Day_Field } from '@src/data_struct/message_v1';
import { Message_Amount_In_Day_Type, get_Date_Key_VN } from '@src/schema/message';

export async function get_Message_Amount_In_Day(account_id: string): Promise<Message_Amount_In_Day_Field | undefined> {
    const now = new Date();
    const date_key = get_Date_Key_VN(now);

    const db = get_Db_Monggo();
    const col = db.collection<Message_Amount_In_Day_Type>('message_amount_in_day');

    const data = await col.findOne<Message_Amount_In_Day_Field>({
        account_id: account_id,
        date_key: date_key,
    });

    return data ? data : undefined;
}

import { getDbMonggo } from '@src/connect/mongo';
import { MessageAmountInDayField } from '@src/dataStruct/message_v1';
import { MessageAmountInDayType } from '@src/schema/message';

export async function getMessageAmountInDay(account_id: number): Promise<MessageAmountInDayField | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const db = getDbMonggo();
    const col = db.collection<MessageAmountInDayType>('messageAmountInDay');

    const data = await col.findOne<MessageAmountInDayField>({ account_id: account_id, timestamp: today });

    return data ? data : undefined;
}

import { getDbMonggo } from '@src/connect/mongo';
import { MessageAmountInDayField } from '@src/dataStruct/message_v1';
import { MessageAmountInDayType, getDateKeyVN } from '@src/schema/message';

export async function getMessageAmountInDay(account_id: number): Promise<MessageAmountInDayField | undefined> {
    const now = new Date();
    const dateKey = getDateKeyVN(now);

    const db = getDbMonggo();
    const col = db.collection<MessageAmountInDayType>('messageAmountInDay');

    const data = await col.findOne<MessageAmountInDayField>({
        account_id: account_id,
        dateKey: dateKey,
    });

    return data ? data : undefined;
}

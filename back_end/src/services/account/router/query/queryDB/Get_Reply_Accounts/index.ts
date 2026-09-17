import { pool } from '@src/connect/postgresql';
import { Account_Field, Paged_Account_Field } from '@src/data_struct/account';
import { Get_Reply_Account_Body_Field } from '@src/data_struct/account/body';

class QueryDB_Get_Reply_Account {
    private _get_reply_account_body: Get_Reply_Account_Body_Field | undefined;

    set_Get_Reply_Account_Body(get_reply_account_body: Get_Reply_Account_Body_Field): void {
        this._get_reply_account_body = get_reply_account_body;
    }

    async run(): Promise<Paged_Account_Field | void> {
        if (this._get_reply_account_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Account_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_not_reply_accounts($1, $2, $3);`, [
                    this._get_reply_account_body.page,
                    this._get_reply_account_body.size,
                    this._get_reply_account_body.chat_room_id,
                ]);

                const data: Paged_Account_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Reply_Account;

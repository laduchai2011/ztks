import { pool } from '@src/connect/postgresql';
import { Chat_Session_Field, Paged_Chat_Session_Field } from '@src/datastruct/chat_session';
import { Chat_Session_With_Account_Id_Body_Field } from '@src/datastruct/chat_session/body';

class QueryDB_Get_Chat_Sessions_With_Account_Id {
    private _chat_session__with_account_id_body: Chat_Session_With_Account_Id_Body_Field | undefined;

    set_Chat_Session_With_Account_Id_Body(
        chat_session__with_account_id_body: Chat_Session_With_Account_Id_Body_Field
    ): void {
        this._chat_session__with_account_id_body = chat_session__with_account_id_body;
    }

    async run(): Promise<Paged_Chat_Session_Field | void> {
        if (this._chat_session__with_account_id_body !== undefined) {
            const zalo_oa_id = this._chat_session__with_account_id_body.zalo_oa_id
                ? this._chat_session__with_account_id_body.zalo_oa_id
                : null;
            const account_id = this._chat_session__with_account_id_body.account_id
                ? this._chat_session__with_account_id_body.account_id
                : null;
            try {
                const result = await pool.query<{
                    items: Chat_Session_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_chat_sessions_with_account_id($1, $2, $3, $4);`, [
                    this._chat_session__with_account_id_body.page,
                    this._chat_session__with_account_id_body.size,
                    zalo_oa_id,
                    account_id,
                ]);

                const data: Paged_Chat_Session_Field = {
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

export default QueryDB_Get_Chat_Sessions_With_Account_Id;

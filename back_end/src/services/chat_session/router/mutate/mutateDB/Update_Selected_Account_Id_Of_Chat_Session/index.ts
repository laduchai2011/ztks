import { pool } from '@src/connect/postgresql';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { Update_Selected_Account_Id_Of_Chat_Session_Body_Field } from '@src/data_struct/chat_session/body';

class MutateDB_Update_Selected_Account_Id_Of_Chat_Session {
    private _update_selected_account_id_of_chat_session_body:
        | Update_Selected_Account_Id_Of_Chat_Session_Body_Field
        | undefined;

    set_Update_Selected_Account_Id_Of_Chat_Session_Body(
        update_selected_account_id_of_chat_session_body: Update_Selected_Account_Id_Of_Chat_Session_Body_Field
    ): void {
        this._update_selected_account_id_of_chat_session_body = update_selected_account_id_of_chat_session_body;
    }

    async run(): Promise<Chat_Session_Field | undefined> {
        if (this._update_selected_account_id_of_chat_session_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Session_Field>(
                    `SELECT * FROM update_selected_account_id_of_chat_session($1, $2, $3);`,
                    [
                        this._update_selected_account_id_of_chat_session_body.id,
                        this._update_selected_account_id_of_chat_session_body.selected_account_id,
                        this._update_selected_account_id_of_chat_session_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Update_Selected_Account_Id_Of_Chat_Session;

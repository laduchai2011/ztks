import { pool } from '@src/connect/postgresql';
import { Chat_Session_Field } from '@src/datastruct/chat_session';
import { Update_Is_Ready_Of_Chat_Session_Body_Field } from '@src/datastruct/chat_session/body';

class MutateDB_Update_Is_Ready_Of_Chat_Session {
    private _update_is_ready_of_chat_session_body: Update_Is_Ready_Of_Chat_Session_Body_Field | undefined;

    set_Update_Is_Ready_Of_Chat_Session_Body(
        update_is_ready_of_chat_session_body: Update_Is_Ready_Of_Chat_Session_Body_Field
    ): void {
        this._update_is_ready_of_chat_session_body = update_is_ready_of_chat_session_body;
    }

    async run(): Promise<Chat_Session_Field | undefined> {
        if (this._update_is_ready_of_chat_session_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Session_Field>(
                    `SELECT * FROM update_is_ready_of_chat_session($1, $2, $3);`,
                    [
                        this._update_is_ready_of_chat_session_body.id,
                        this._update_is_ready_of_chat_session_body.is_ready,
                        this._update_is_ready_of_chat_session_body.account_id,
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

export default MutateDB_Update_Is_Ready_Of_Chat_Session;

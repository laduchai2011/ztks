import { pool } from '@src/connect/postgresql';
import { Leave_All_Chat_Session_Body_Field } from '@src/data_struct/chat_session/body';

class MutateDB_Leave_All_Chat_Session {
    private _leave_all_chat_session_body: Leave_All_Chat_Session_Body_Field | undefined;

    set_Leave_All_Chat_Session_Body(leave_all_chat_session_body: Leave_All_Chat_Session_Body_Field): void {
        this._leave_all_chat_session_body = leave_all_chat_session_body;
    }

    async run(): Promise<boolean | undefined> {
        if (this._leave_all_chat_session_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<{ success: boolean }>(
                    'SELECT * FROM leave_all_chat_session($1::UUID)',
                    [this._leave_all_chat_session_body.account_id]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0].success;
                }
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Leave_All_Chat_Session;

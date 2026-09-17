import { pool } from '@src/connect/postgresql';
import { Chat_Session_Field } from '@src/datastruct/chat_session';
import { Chat_Session_Body_Field } from '@src/datastruct/chat_session/body';
import { Zalo_Oa_Field } from '@src/dataStruct/zalo';
import { Is_My_Oa_Body_Field } from '@src/dataStruct/zalo/body';

class MutateDB_Create_Chat_Session {
    private _chat_session_body: Chat_Session_Body_Field | undefined;
    private _is_my_oa_body: Is_My_Oa_Body_Field | undefined;

    set_Chat_Session_Body(chat_session_body: Chat_Session_Body_Field): void {
        this._chat_session_body = chat_session_body;
    }

    set_Is_My_Oa_Body(is_my_oa_body: Is_My_Oa_Body_Field): void {
        this._is_my_oa_body = is_my_oa_body;
    }

    async is_My_Oa(): Promise<Zalo_Oa_Field | undefined> {
        if (this._is_my_oa_body !== undefined) {
            try {
                const result = await pool.query<Zalo_Oa_Field>(`SELECT * FROM is_my_oa($1, $2);`, [
                    this._is_my_oa_body.id,
                    this._is_my_oa_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }

    async run(): Promise<Chat_Session_Field | undefined> {
        if (this._chat_session_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Session_Field>(
                    `SELECT * FROM create_chat_session($1, $2, $3, $4, $5, $6);`,
                    [
                        this._chat_session_body.label,
                        this._chat_session_body.code,
                        this._chat_session_body.is_ready,
                        this._chat_session_body.selected_account_id,
                        this._chat_session_body.zalo_oa_id,
                        this._chat_session_body.account_id,
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

export default MutateDB_Create_Chat_Session;

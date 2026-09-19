import { pool } from '@src/connect/postgresql';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { User_Take_Session_To_Chat_Body_Field } from '@src/data_struct/chat_session/body';

class QueryDB_User_Take_Session_To_Chat {
    private _user_take_session_to_chat_body: User_Take_Session_To_Chat_Body_Field | undefined;

    set_User_Take_Session_To_Chat_Body(user_take_session_to_chat_body: User_Take_Session_To_Chat_Body_Field): void {
        this._user_take_session_to_chat_body = user_take_session_to_chat_body;
    }

    async run(): Promise<Chat_Session_Field | void> {
        if (this._user_take_session_to_chat_body !== undefined) {
            try {
                const result = await pool.query<Chat_Session_Field>(
                    `SELECT * FROM user_take_session_to_chat($1, $2);`,
                    [this._user_take_session_to_chat_body.code, this._user_take_session_to_chat_body.zalo_oa_id]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_User_Take_Session_To_Chat;

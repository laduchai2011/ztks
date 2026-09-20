import { pool } from '@src/connect/postgresql';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { User_Take_Room_To_Chat_Body_Field } from '@src/data_struct/chat_room/body';

class QueryDB_User_Take_Room_To_Chat {
    private _user_take_room_to_chat_body: User_Take_Room_To_Chat_Body_Field | undefined;

    set_User_Take_Room_To_Chat_Body(user_take_room_to_chat_body: User_Take_Room_To_Chat_Body_Field): void {
        this._user_take_room_to_chat_body = user_take_room_to_chat_body;
    }

    async run(): Promise<Chat_Room_Field | void> {
        if (this._user_take_room_to_chat_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Field>(`SELECT * FROM user_take_room_to_chat($1, $2);`, [
                    this._user_take_room_to_chat_body.user_id_by_app,
                    this._user_take_room_to_chat_body.zalo_oa_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_User_Take_Room_To_Chat;

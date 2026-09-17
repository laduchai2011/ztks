import { pool } from '@src/connect/postgresql';
import { Chat_Room_Phone_Field } from '@src/datastruct/chat_room';
import { Get_Latest_Chat_Room_Phone_Body_Field } from '@src/datastruct/chat_room/body';

class QueryDB_Get_Latest_Chat_Room_Phone {
   
    private _get_latest_chat_room_phone_body: Get_Latest_Chat_Room_Phone_Body_Field | undefined;

    set_Get_Latest_Chat_Room_Phone_Body(get_latest_chat_room_phone_body: Get_Latest_Chat_Room_Phone_Body_Field): void {
        this._get_latest_chat_room_phone_body = get_latest_chat_room_phone_body;
    }

    async run(): Promise<Chat_Room_Phone_Field | void> {
        if (this._get_latest_chat_room_phone_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Phone_Field>(`SELECT * FROM get_latest_chat_room_phone($1, $2);`, [
                    this._get_latest_chat_room_phone_body.chat_room_id,
                    this._get_latest_chat_room_phone_body.account_id   
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Latest_Chat_Room_Phone;

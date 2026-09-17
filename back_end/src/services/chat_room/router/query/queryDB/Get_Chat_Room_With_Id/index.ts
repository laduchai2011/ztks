import { pool } from '@src/connect/postgresql';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Get_Chat_Room_With_Id_Body_Field } from '@src/data_struct/chat_room/body';

class QueryDB_Get_Chat_Room_With_Id {
    private _get_chat_room_with_id_body: Get_Chat_Room_With_Id_Body_Field | undefined;

    set_Get_Chat_Room_With_Id_Body(get_chat_room_with_id_body: Get_Chat_Room_With_Id_Body_Field): void {
        this._get_chat_room_with_id_body = get_chat_room_with_id_body;
    }

    async run(): Promise<Chat_Room_Field | void> {
        if (this._get_chat_room_with_id_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Field>(`SELECT * FROM get_chat_room_with_id($1);`, [
                    this._get_chat_room_with_id_body.id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Chat_Room_With_Id;

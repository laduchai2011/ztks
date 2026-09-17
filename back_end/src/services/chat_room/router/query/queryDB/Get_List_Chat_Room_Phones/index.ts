import { pool } from '@src/connect/postgresql';
import { Chat_Room_Phone_Field } from '@src/data_struct/chat_room';
import { Get_List_Chat_Room_Phones_Body_Field } from '@src/data_struct/chat_room/body';

class QueryDB_Get_List_Chat_Room_Phones {
    private _get_list_chat_room_phones_body: Get_List_Chat_Room_Phones_Body_Field | undefined;

    set_Get_List_Chat_Room_Phones_Body(get_list_chat_room_phones_body: Get_List_Chat_Room_Phones_Body_Field): void {
        this._get_list_chat_room_phones_body = get_list_chat_room_phones_body;
    }

    async run(): Promise<Chat_Room_Phone_Field[] | void> {
        if (this._get_list_chat_room_phones_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Phone_Field>(
                    `SELECT * FROM get_list_chat_room_phones($1, $2);`,
                    [this._get_list_chat_room_phones_body.chat_room_id, this._get_list_chat_room_phones_body.account_id]
                );

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_List_Chat_Room_Phones;

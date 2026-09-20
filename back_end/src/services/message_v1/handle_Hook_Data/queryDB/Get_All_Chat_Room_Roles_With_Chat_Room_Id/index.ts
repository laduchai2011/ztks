import { pool } from '@src/connect/postgresql';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';

class QueryDB_Get_All_Chat_Room_Roles_With_Chat_Room_Id {
    private _chat_room_id: string | undefined;

    set_Chat_Room_Id(chat_room_id: string): void {
        this._chat_room_id = chat_room_id;
    }

    async run(): Promise<Chat_Room_Role_Field[] | void> {
        if (this._chat_room_id !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Role_Field>(
                    `SELECT * FROM get_all_chat_room_roles_with_chat_room_id($1);`,
                    [this._chat_room_id]
                );

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_All_Chat_Room_Roles_With_Chat_Room_Id;

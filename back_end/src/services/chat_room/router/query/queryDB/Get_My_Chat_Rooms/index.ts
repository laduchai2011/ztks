import { pool } from '@src/connect/postgresql';
import { Chat_Room_Field, Paged_Chat_Room_Field } from '@src/data_struct/chat_room';
import { Get_My_Chat_Rooms_Body_Field } from '@src/data_struct/chat_room/body';

class QueryDB_Get_My_Chat_Rooms {
    private _get_my_chat_rooms_body: Get_My_Chat_Rooms_Body_Field | undefined;

    set_Get_My_Chat_Rooms_Body(get_my_chat_rooms_body: Get_My_Chat_Rooms_Body_Field): void {
        this._get_my_chat_rooms_body = get_my_chat_rooms_body;
    }

    async run(): Promise<Paged_Chat_Room_Field | void> {
        if (this._get_my_chat_rooms_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Chat_Room_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_my_chat_rooms($1, $2, $3);`, [
                    this._get_my_chat_rooms_body.page,
                    this._get_my_chat_rooms_body.size,
                    this._get_my_chat_rooms_body.account_id,
                ]);

                const data: Paged_Chat_Room_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_My_Chat_Rooms;

import { pool } from '@src/connect/postgresql';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { Chat_Room_Body_Field } from '@src/data_struct/chat_room/body';

class MutateDB_Create_Chat_Room {
    private _chat_room_body: Chat_Room_Body_Field | undefined;

    set_Chat_Room_Body(chat_room_body: Chat_Room_Body_Field): void {
        this._chat_room_body = chat_room_body;
    }

    async run(): Promise<Chat_Room_Field | undefined> {
        if (this._chat_room_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Room_Field>(`SELECT * FROM create_chat_room($1, $2, $3);`, [
                    this._chat_room_body.user_id_by_app,
                    this._chat_room_body.zalo_oa_id,
                    this._chat_room_body.account_id,
                ]);

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

export default MutateDB_Create_Chat_Room;

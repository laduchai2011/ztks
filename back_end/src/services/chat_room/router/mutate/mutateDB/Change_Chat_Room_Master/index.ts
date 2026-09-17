import { pool } from '@src/connect/postgresql';
import { Chat_Room_Field } from '@src/datastruct/chat_room';
import { Change_Chat_Room_Master_Body_Field } from '@src/datastruct/chat_room/body';

class MutateDB_Change_Chat_Room_Master {
    private _change_chat_room_master_body: Change_Chat_Room_Master_Body_Field | undefined;

    set_Change_Chat_Room_Master_Body(change_chat_room_master_body: Change_Chat_Room_Master_Body_Field): void {
        this._change_chat_room_master_body = change_chat_room_master_body;
    }

    async run(): Promise<Chat_Room_Field | undefined> {
        if (this._change_chat_room_master_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Room_Field>(`SELECT * FROM change_chat_room_master($1, $2, $3);`, [
                    this._change_chat_room_master_body.chat_room_id,
                    this._change_chat_room_master_body.new_account_id,
                    this._change_chat_room_master_body.account_id,
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

export default MutateDB_Change_Chat_Room_Master;

import { pool } from '@src/connect/postgresql';
import { Chat_Room_Role_Field } from '@src/datastruct/chat_room';
import { Update_Setup_Chat_Room_Role_Body_Field } from '@src/datastruct/chat_room/body';

class MutateDB_Update_Setup_Chat_Room_Role {
    private _update_setup_chat_room_role_body: Update_Setup_Chat_Room_Role_Body_Field | undefined;

    set_Update_Setup_Chat_Room_Role_Body(
        update_setup_chat_room_role_body: Update_Setup_Chat_Room_Role_Body_Field
    ): void {
        this._update_setup_chat_room_role_body = update_setup_chat_room_role_body;
    }

    async run(): Promise<Chat_Room_Role_Field | undefined> {
        if (this._update_setup_chat_room_role_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Chat_Room_Role_Field>(
                    `SELECT * FROM update_setup_chat_room_role($1, $2, $3, $4, $5);`,
                    [
                        this._update_setup_chat_room_role_body.id,
                        this._update_setup_chat_room_role_body.back_ground_color,
                        this._update_setup_chat_room_role_body.is_read,
                        this._update_setup_chat_room_role_body.is_send,
                        this._update_setup_chat_room_role_body.account_id,
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

export default MutateDB_Update_Setup_Chat_Room_Role;

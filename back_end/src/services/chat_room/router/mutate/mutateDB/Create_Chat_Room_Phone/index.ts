import { pool } from '@src/connect/postgresql';
import { Chat_Room_Phone_Field } from '@src/datastruct/chat_room';
import { Create_Chat_Room_Phone_Body_Field } from '@src/datastruct/chat_room/body';

class MutateDB_Create_Chat_Room_Phone {
  
    private _create_chat_room_phone_body: Create_Chat_Room_Phone_Body_Field | undefined;

    set_Create_Chat_Room_Phone_Body(create_chat_room_phone_body: Create_Chat_Room_Phone_Body_Field): void {
        this._create_chat_room_phone_body = create_chat_room_phone_body;
    }

    async run(): Promise<Chat_Room_Phone_Field | undefined> {
        if (this._create_chat_room_phone_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');
                                                                
                const result = await pool.query<Chat_Room_Phone_Field>(`SELECT * FROM create_chat_room_phone($1, $2, $3);`, [
                    this._create_chat_room_phone_body.phone,
                    this._create_chat_room_phone_body.chat_room_id,
                    this._create_chat_room_phone_body.account_id
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

export default MutateDB_Create_Chat_Room_Phone;

import { pool } from '@src/connect/postgresql';
import { Chat_Room_Role_Field } from '@src/datastruct/chat_room';
import { Chat_Room_Role_With_Crid_Aaid_Body_Field } from '@src/datastruct/chat_room/body';

class QueryDB_Get_Chat_Room_Role_With_Crid_Aaid {
   
    private _chat_room_role_with_crid_aaid_body: Chat_Room_Role_With_Crid_Aaid_Body_Field | undefined;

    set_Chat_Room_Role_With_Crid_Aaid_Body(chat_room_role_with_crid_aaid_body: Chat_Room_Role_With_Crid_Aaid_Body_Field): void {
        this._chat_room_role_with_crid_aaid_body = chat_room_role_with_crid_aaid_body;
    }

    async run(): Promise<Chat_Room_Role_Field | void> {
        if (this._chat_room_role_with_crid_aaid_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Role_Field>(`SELECT * FROM get_chat_room_role_with_crid_aaid($1, $2);`, [
                    this._chat_room_role_with_crid_aaid_body.authorized_account_id,
                    this._chat_room_role_with_crid_aaid_body.chat_room_id   
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Chat_Room_Role_With_Crid_Aaid;

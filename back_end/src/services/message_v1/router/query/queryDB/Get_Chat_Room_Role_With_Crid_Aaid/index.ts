import { pool } from '@src/connect/postgresql';
import { Chat_Room_Role_Field } from '@src/data_struct/chat_room';
import { Get_Chat_Room_Role_With_Crid_Aaid_Body_Field } from '@src/data_struct/chat_room/body';

class QueryDB_Get_Chat_Room_Role_With_Crid_Aaid {
    private _get_chat_room_role_with_crid_aaid_body: Get_Chat_Room_Role_With_Crid_Aaid_Body_Field | undefined;

    set_Get_Chat_Room_Role_With_Crid_Aaid_Body(
        get_chat_room_role_with_crid_aaid_body: Get_Chat_Room_Role_With_Crid_Aaid_Body_Field
    ): void {
        this._get_chat_room_role_with_crid_aaid_body = get_chat_room_role_with_crid_aaid_body;
    }

    async run(): Promise<Chat_Room_Role_Field | void> {
        if (this._get_chat_room_role_with_crid_aaid_body !== undefined) {
            try {
                const result = await pool.query<Chat_Room_Role_Field>(
                    `SELECT * FROM get_chat_room_role_with_crid_aaid($1, $2);`,
                    [
                        this._get_chat_room_role_with_crid_aaid_body.authorized_account_id,
                        this._get_chat_room_role_with_crid_aaid_body.chat_room_id,
                    ]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Chat_Room_Role_With_Crid_Aaid;

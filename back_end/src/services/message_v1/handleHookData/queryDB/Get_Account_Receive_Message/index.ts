import { pool } from '@src/connect/postgresql';
import { Account_Receive_Message_Field } from '@src/data_struct/account';
import { Get_Account_Receive_Message_Body_Field } from '@src/data_struct/account/body';

class QueryDB_Get_Account_Receive_Message {
    private _get_account_receive_message_body: Get_Account_Receive_Message_Body_Field | undefined;

    set_Get_Account_Receive_Message_Body(
        get_account_receive_message_body: Get_Account_Receive_Message_Body_Field
    ): void {
        this._get_account_receive_message_body = get_account_receive_message_body;
    }

    async run(): Promise<Account_Receive_Message_Field | void> {
        if (this._get_account_receive_message_body !== undefined) {
            try {
                const result = await pool.query<Account_Receive_Message_Field>(
                    `SELECT * FROM get_account_receive_message($1, $2);`,
                    [
                        this._get_account_receive_message_body.zalo_oa_id,
                        this._get_account_receive_message_body.account_id,
                    ]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Account_Receive_Message;

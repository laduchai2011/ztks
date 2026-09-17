import { pool } from '@src/connect/postgresql';
import { Account_Receive_Message_Field } from '@src/data_struct/account';
import { Create_Account_Receive_Message_Body_Field } from '@src/data_struct/account/body';

class MutateDB_Create_Account_Receive_Message {
    private _create_account_receive_message_body: Create_Account_Receive_Message_Body_Field | undefined;

    set_Create_Account_Receive_Message_Body(
        create_account_receive_message_body: Create_Account_Receive_Message_Body_Field
    ): void {
        this._create_account_receive_message_body = create_account_receive_message_body;
    }

    async run(): Promise<Account_Receive_Message_Field | undefined> {
        if (this._create_account_receive_message_body !== undefined) {
            const client = await pool.connect();

            try {
                const account_id_receive_message = this._create_account_receive_message_body.account_id_receive_message
                    ? this._create_account_receive_message_body.account_id_receive_message
                    : null;

                await client.query('BEGIN');

                const result = await pool.query<Account_Receive_Message_Field>(
                    `SELECT * FROM create_account_receive_message($1, $2, $3);`,
                    [
                        this._create_account_receive_message_body.zalo_oa_id,
                        this._create_account_receive_message_body.account_id,
                        account_id_receive_message,
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

export default MutateDB_Create_Account_Receive_Message;

import { pool } from '@src/connect/postgresql';
import { Account_Receive_Message_Field } from '@src/dataStruct/account';
import { Update_Account_Receive_Message_Body_Field } from '@src/dataStruct/account/body';

class MutateDB_Update_Account_Receive_Message {
  
    private _update_account_receive_message_body: Update_Account_Receive_Message_Body_Field | undefined;

    set_Update_Account_Receive_Message_Body(update_account_receive_message_body: Update_Account_Receive_Message_Body_Field): void {
        this._update_account_receive_message_body = update_account_receive_message_body;
    }

    async run(): Promise<Account_Receive_Message_Field | undefined> {
        if (this._update_account_receive_message_body !== undefined) {
            const client = await pool.connect();

            try {
                const account_id_receive_message = this._update_account_receive_message_body.account_id_receive_message
                    ? this._update_account_receive_message_body.account_id_receive_message
                    : null

                await client.query('BEGIN');
                                                                                
                const result = await pool.query<Account_Receive_Message_Field>(`SELECT * FROM update_account_receive_message($1, $2, $3);`, [
                    this._update_account_receive_message_body.zalo_oa_id,
                    this._update_account_receive_message_body.account_id,
                    account_id_receive_message
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

export default MutateDB_Update_Account_Receive_Message;

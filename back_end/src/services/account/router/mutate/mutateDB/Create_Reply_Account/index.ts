import { pool } from '@src/connect/postgresql';
import { Account_Field } from '@src/dataStruct/account';
import { Create_Reply_Account_Body_Field } from '@src/dataStruct/account/body';

class MutateDB_Create_Reply_Account {

    private _create_reply_account_body: Create_Reply_Account_Body_Field | undefined;

    set_Create_Reply_Account_Body(create_reply_account_body: Create_Reply_Account_Body_Field): void {
        this._create_reply_account_body = create_reply_account_body;
    }

    async run(): Promise<Account_Field | undefined> {
        if (this._create_reply_account_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');
                                                                
                const result = await pool.query<Account_Field>(`SELECT * FROM create_reply_account($1, $2, $3);`, [
                    this._create_reply_account_body.authorized_account_id,
                    this._create_reply_account_body.chat_room_id,
                    this._create_reply_account_body.account_id
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

export default MutateDB_Create_Reply_Account;

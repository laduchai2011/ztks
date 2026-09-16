import { pool } from '@src/connect/postgresql';
import { Account_Field } from '@src/dataStruct/account';
import { Forget_Password_Body_Field } from '@src/dataStruct/account/body';

class MutateDB_Forget_Password {
    private _forget_password_body: Forget_Password_Body_Field | undefined;

    set_Forget_Password_Body(forget_password_body: Forget_Password_Body_Field): void {
        this._forget_password_body = forget_password_body;
    }

    async run(): Promise<Account_Field | undefined> {
        if (this._forget_password_body !== undefined) {
            const client = await pool.connect();

            try {

                await client.query('BEGIN');
                                                                
                const result = await pool.query<Account_Field>(`SELECT * FROM forget_password($1, $2, $3);`, [
                    this._forget_password_body.user_name,
                    this._forget_password_body.password,
                    this._forget_password_body.phone
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

export default MutateDB_Forget_Password;

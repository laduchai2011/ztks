import { pool } from '@src/connect/postgresql';
import { Account_Field } from '@src/dataStruct/account';
import { Check_Forget_Password_Body_Field } from '@src/dataStruct/account/body';

class QueryDB_Check_Forget_Password {

    private _check_forget_password_body: Check_Forget_Password_Body_Field | undefined;

    set_Check_Forget_Password_Body(check_forget_password_body: Check_Forget_Password_Body_Field): void {
        this._check_forget_password_body = check_forget_password_body;
    }

    async run(): Promise<Account_Field | void> {
        if (this._check_forget_password_body !== undefined) {
            try {
                const result = await pool.query<Account_Field>(`SELECT * FROM check_forget_password($1, $2);`, [
                    this._check_forget_password_body.user_name,
                    this._check_forget_password_body.phone,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Check_Forget_Password;

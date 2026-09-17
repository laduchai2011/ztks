import { pool } from '@src/connect/postgresql';
import { Account_Field } from '@src/data_struct/account';
import { Edit_Infor_Account_Body_Field } from '@src/data_struct/account/body';

class MutateDB_Edit_Infor_Account {
    private _edit_infor_account_body: Edit_Infor_Account_Body_Field | undefined;

    set_Edit_Infor_Account_Body(edit_infor_account_body: Edit_Infor_Account_Body_Field): void {
        this._edit_infor_account_body = edit_infor_account_body;
    }

    async run(): Promise<Account_Field | undefined> {
        if (this._edit_infor_account_body !== undefined) {
            const client = await pool.connect();

            try {
                const avatar = this._edit_infor_account_body.avatar ? this._edit_infor_account_body.avatar : null;

                await client.query('BEGIN');

                const result = await pool.query<Account_Field>(`SELECT * FROM edit_infor_account($1, $2, $3, $4);`, [
                    this._edit_infor_account_body.id,
                    this._edit_infor_account_body.first_name,
                    this._edit_infor_account_body.last_name,
                    avatar,
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

export default MutateDB_Edit_Infor_Account;

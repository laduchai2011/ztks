import { pool } from '@src/connect/postgresql';
import { Account_Information_Field } from '@src/data_struct/account';
import { Get_My_Account_Information_Body_Field } from '@src/data_struct/account/body';

class QueryDB_Get_My_Account_Information {
    private _get_my_account_information_body: Get_My_Account_Information_Body_Field | undefined;

    set_Get_My_Account_Information_Body(get_my_account_information_body: Get_My_Account_Information_Body_Field): void {
        this._get_my_account_information_body = get_my_account_information_body;
    }

    async run(): Promise<Account_Information_Field | void> {
        if (this._get_my_account_information_body !== undefined) {
            try {
                const result = await pool.query<Account_Information_Field>(
                    `SELECT * FROM get_my_account_information($1);`,
                    [this._get_my_account_information_body.account_id]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_My_Account_Information;

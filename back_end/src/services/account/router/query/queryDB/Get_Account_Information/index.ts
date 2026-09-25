import { pool } from '@src/connect/postgresql';
import { Account_Information_Field } from '@src/data_struct/account';

class QueryDB_Get_Account_Information {
    private _account_id: string | undefined;

    set_Account_Id(account_id: string): void {
        this._account_id = account_id;
    }

    async run(): Promise<Account_Information_Field | void> {
        if (this._account_id !== undefined) {
            try {
                const result = await pool.query<Account_Information_Field>(
                    'SELECT * FROM get_account_information($1::UUID)',
                    [this._account_id]
                );

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Account_Information;

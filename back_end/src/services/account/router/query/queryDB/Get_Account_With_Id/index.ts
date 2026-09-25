import { pool } from '@src/connect/postgresql';
import { Account_Field } from '@src/data_struct/account';

class QueryDB_Get_Account_With_Id {
    private _account_id: string | undefined;

    set_Account_Id(account_id: string): void {
        this._account_id = account_id;
    }

    async run(): Promise<Account_Field | void> {
        if (this._account_id !== undefined) {
            try {
                const result = await pool.query<Account_Field>('SELECT * FROM get_account_with_id($1::UUID)', [
                    this._account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Account_With_Id;

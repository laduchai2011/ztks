import { pool } from '@src/connect/postgresql';
import { Bank_Field } from '@src/data_struct/bank';
import { Get_All_Banks_Body_Field } from '@src/data_struct/bank/body';

class QueryDB_Get_All_Banks {
    private _get_all_banks_body: Get_All_Banks_Body_Field | undefined;

    set_Get_All_Banks_Body(get_all_banks_body: Get_All_Banks_Body_Field): void {
        this._get_all_banks_body = get_all_banks_body;
    }

    async run(): Promise<Bank_Field[] | void> {
        if (this._get_all_banks_body !== undefined) {
            try {
                const result = await pool.query<Bank_Field>(`SELECT * FROM get_all_banks($1);`, [
                    this._get_all_banks_body.account_id,
                ]);

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_All_Banks;

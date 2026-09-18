import { pool } from '@src/connect/postgresql';
import { Balance_Fluctuation_Field } from '@src/data_struct/wallet';
import { Get_Balance_Fluctuations_Body_Field } from '@src/data_struct/wallet/body';

class QueryDB_Get_Balance_Fluctuations {
    private _get_balance_fluctuations_body: Get_Balance_Fluctuations_Body_Field | undefined;

    set_Get_Balance_Fluctuations_Body(get_balance_fluctuations_body: Get_Balance_Fluctuations_Body_Field): void {
        this._get_balance_fluctuations_body = get_balance_fluctuations_body;
    }

    async run(): Promise<Balance_Fluctuation_Field[] | void> {
        if (this._get_balance_fluctuations_body !== undefined) {
            try {
                const result = await pool.query<Balance_Fluctuation_Field>(
                    `SELECT * FROM get_balance_fluctuations($1, $2, $3);`,
                    [
                        this._get_balance_fluctuations_body.page,
                        this._get_balance_fluctuations_body.size,
                        this._get_balance_fluctuations_body.wallet_id,
                    ]
                );

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Balance_Fluctuations;

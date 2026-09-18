import { pool } from '@src/connect/postgresql';
import { Wallet_Field } from '@src/data_struct/wallet';
import { Get_My_Wallet_With_Type_Body_Field } from '@src/data_struct/wallet/body';

class QueryDB_Get_My_Wallet_With_Type {
    private _get_my_wallet_with_type_body: Get_My_Wallet_With_Type_Body_Field | undefined;

    set_Get_My_Wallet_With_Type_Body(get_my_wallet_with_type_body: Get_My_Wallet_With_Type_Body_Field): void {
        this._get_my_wallet_with_type_body = get_my_wallet_with_type_body;
    }

    async run(): Promise<Wallet_Field | void> {
        if (this._get_my_wallet_with_type_body !== undefined) {
            try {
                const result = await pool.query<Wallet_Field>(`SELECT * FROM get_my_wallet_with_type($1, $2);`, [
                    this._get_my_wallet_with_type_body.type,
                    this._get_my_wallet_with_type_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_My_Wallet_With_Type;

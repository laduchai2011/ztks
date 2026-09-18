import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Create_Require_Take_Money_Body_Field } from '@src/data_struct/wallet/body';

class MutateDB_Create_Require_Take_Money {
    private _create_require_take_money_body: Create_Require_Take_Money_Body_Field | undefined;

    set_Create_Require_Take_Money_Body(create_require_take_money_body: Create_Require_Take_Money_Body_Field): void {
        this._create_require_take_money_body = create_require_take_money_body;
    }

    async run(): Promise<Require_Take_Money_Field | undefined> {
        if (this._create_require_take_money_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Require_Take_Money_Field>(
                    `SELECT * FROM create_require_take_money($1, $2, $3, $4);`,
                    [
                        this._create_require_take_money_body.amount,
                        this._create_require_take_money_body.bank_id,
                        this._create_require_take_money_body.wallet_id,
                        this._create_require_take_money_body.account_id,
                    ]
                );

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

export default MutateDB_Create_Require_Take_Money;

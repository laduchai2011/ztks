import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Edit_Require_Take_Money_Body_Field } from '@src/data_struct/wallet/body';

class MutateDB_Edit_Require_Take_Money {
    private _edit_require_take_money_body: Edit_Require_Take_Money_Body_Field | undefined;

    set_Edit_Require_Take_Money_Body(edit_require_take_money_body: Edit_Require_Take_Money_Body_Field): void {
        this._edit_require_take_money_body = edit_require_take_money_body;
    }

    async run(): Promise<Require_Take_Money_Field | undefined> {
        if (this._edit_require_take_money_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Require_Take_Money_Field>(
                    `SELECT * FROM edit_require_take_money($1, $2, $3, $4, $5);`,
                    [
                        this._edit_require_take_money_body.require_take_money_id,
                        this._edit_require_take_money_body.amount,
                        this._edit_require_take_money_body.bank_id,
                        this._edit_require_take_money_body.wallet_id,
                        this._edit_require_take_money_body.account_id,
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

export default MutateDB_Edit_Require_Take_Money;

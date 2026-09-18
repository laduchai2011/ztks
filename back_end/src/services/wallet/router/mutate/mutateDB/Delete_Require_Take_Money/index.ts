import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Delete_Require_Take_Money_Body_Field } from '@src/data_struct/wallet/body';

class MutateDB_Delete_Require_Take_Money {
    private _delete_require_take_money_body: Delete_Require_Take_Money_Body_Field | undefined;

    set_Delete_Require_Take_Money_Body(delete_require_take_money_body: Delete_Require_Take_Money_Body_Field): void {
        this._delete_require_take_money_body = delete_require_take_money_body;
    }

    async run(): Promise<Require_Take_Money_Field | undefined> {
        if (this._delete_require_take_money_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Require_Take_Money_Field>(
                    `SELECT * FROM delete_require_take_money($1, $2);`,
                    [
                        this._delete_require_take_money_body.require_take_money_id,
                        this._delete_require_take_money_body.account_id,
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

export default MutateDB_Delete_Require_Take_Money;

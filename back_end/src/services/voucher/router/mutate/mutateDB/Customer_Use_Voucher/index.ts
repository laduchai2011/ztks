import { pool } from '@src/connect/postgresql';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Customer_Use_Voucher_Body_Field } from '@src/data_struct/voucher/body';

class MutateDB_Customer_Use_Voucher {
    private _customer_use_voucher_body: Customer_Use_Voucher_Body_Field | undefined;

    set_Customer_Use_Voucher_Body(customer_use_voucher_body: Customer_Use_Voucher_Body_Field): void {
        this._customer_use_voucher_body = customer_use_voucher_body;
    }

    async run(): Promise<Voucher_Field | undefined> {
        if (this._customer_use_voucher_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Voucher_Field>(`SELECT * FROM customer_use_voucher($1, $2, $3);`, [
                    this._customer_use_voucher_body.order_id,
                    this._customer_use_voucher_body.voucher_id,
                    this._customer_use_voucher_body.customer_id,
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

export default MutateDB_Customer_Use_Voucher;

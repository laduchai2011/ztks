import { pool } from '@src/connect/postgresql';
import { Order_Field } from '@src/data_struct/order';
import { Update_Order_Body_Field } from '@src/data_struct/order/body';

class MutateDB_Update_Order {
    private _update_order_body: Update_Order_Body_Field | undefined;

    set_Update_Order_Body(update_order_body: Update_Order_Body_Field): void {
        this._update_order_body = update_order_body;
    }

    async run(): Promise<Order_Field | undefined> {
        if (this._update_order_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Order_Field>(`SELECT * FROM update_order($1, $2, $3, $4, $5, $6);`, [
                    this._update_order_body.id,
                    this._update_order_body.label,
                    this._update_order_body.content,
                    this._update_order_body.money,
                    this._update_order_body.phone,
                    this._update_order_body.account_id,
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

export default MutateDB_Update_Order;

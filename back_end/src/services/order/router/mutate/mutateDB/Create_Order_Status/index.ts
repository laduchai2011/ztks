import { pool } from '@src/connect/postgresql';
import { Order_Status_Field } from '@src/data_struct/order';
import { Create_Order_Status_Body_Field } from '@src/data_struct/order/body';

class MutateDB_Create_Order_Status {
    private _create_order_status_body: Create_Order_Status_Body_Field | undefined;

    set_Create_Order_Status_Body(create_order_status_body: Create_Order_Status_Body_Field): void {
        this._create_order_status_body = create_order_status_body;
    }

    async run(): Promise<Order_Status_Field | undefined> {
        if (this._create_order_status_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Order_Status_Field>(
                    `SELECT * FROM create_order_status($1, $2, $3, $4);`,
                    [
                        this._create_order_status_body.type,
                        this._create_order_status_body.content,
                        this._create_order_status_body.order_id,
                        this._create_order_status_body.account_id,
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

export default MutateDB_Create_Order_Status;

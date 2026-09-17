import { pool } from '@src/connect/postgresql';
import { Order_Field } from '@src/data_struct/order';
import { Create_Order_Body_Field } from '@src/data_struct/order/body';

class MutateDB_Create_Order {
    private _create_order_body: Create_Order_Body_Field | undefined;

    set_Create_Order_Body(create_order_body: Create_Order_Body_Field): void {
        this._create_order_body = create_order_body;
    }

    async run(): Promise<Order_Field | undefined> {
        if (this._create_order_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Order_Field>(
                    `SELECT * FROM create_order($1, $2, $3, $4, $5, $6, $7);`,
                    [
                        this._create_order_body.uuid,
                        this._create_order_body.label,
                        this._create_order_body.content,
                        this._create_order_body.money,
                        this._create_order_body.phone,
                        this._create_order_body.chat_room_id,
                        this._create_order_body.account_id,
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

export default MutateDB_Create_Order;

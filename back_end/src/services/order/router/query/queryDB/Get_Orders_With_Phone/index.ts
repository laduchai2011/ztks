import { pool } from '@src/connect/postgresql';
import { Order_Field, Paged_Order_Field } from '@src/data_struct/order';
import { Get_Orders_With_Phone_Body_Field } from '@src/data_struct/order/body';

class QueryDB_Get_Orders_With_Phone {
    private _get_orders_with_phone_body: Get_Orders_With_Phone_Body_Field | undefined;

    set_Get_Orders_With_Phone_Body(get_orders_with_phone_body: Get_Orders_With_Phone_Body_Field): void {
        this._get_orders_with_phone_body = get_orders_with_phone_body;
    }

    async run(): Promise<Paged_Order_Field | void> {
        if (this._get_orders_with_phone_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Order_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_orders_with_phone($1, $2, $3);`, [
                    this._get_orders_with_phone_body.page,
                    this._get_orders_with_phone_body.size,
                    this._get_orders_with_phone_body.phone,
                ]);

                const data: Paged_Order_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Orders_With_Phone;

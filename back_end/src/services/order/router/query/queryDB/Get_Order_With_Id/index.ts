import { pool } from '@src/connect/postgresql';
import { Order_Field } from '@src/data_struct/order';
import { Get_Order_With_Id_Body_Field } from '@src/data_struct/order/body';

class QueryDB_Get_Order_With_Id {
    private _get_order_with_id_body: Get_Order_With_Id_Body_Field | undefined;

    set_Get_Order_With_Id_Body(get_order_with_id_body: Get_Order_With_Id_Body_Field): void {
        this._get_order_with_id_body = get_order_with_id_body;
    }

    async run(): Promise<Order_Field | void> {
        if (this._get_order_with_id_body !== undefined) {
            try {
                const result = await pool.query<Order_Field>(`SELECT * FROM get_order_with_id($1);`, [
                    this._get_order_with_id_body.id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Order_With_Id;

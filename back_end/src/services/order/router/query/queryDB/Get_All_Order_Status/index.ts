import { pool } from '@src/connect/postgresql';
import { Order_Status_Field } from '@src/data_struct/order';
import { Get_All_Order_Status_Body_Field } from '@src/data_struct/order/body';

class QueryDB_Get_All_Order_Status {
    private _get_all_order_status_body: Get_All_Order_Status_Body_Field | undefined;

    set_Get_All_Order_Status_Body(get_all_order_status_body: Get_All_Order_Status_Body_Field): void {
        this._get_all_order_status_body = get_all_order_status_body;
    }

    async run(): Promise<Order_Status_Field[] | void> {
        if (this._get_all_order_status_body !== undefined) {
            try {
                const result = await pool.query<Order_Status_Field>(`SELECT * FROM get_all_order_status($1);`, [
                    this._get_all_order_status_body.order_id,
                ]);

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_All_Order_Status;

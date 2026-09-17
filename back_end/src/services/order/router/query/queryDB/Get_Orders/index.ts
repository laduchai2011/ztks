import { pool } from '@src/connect/postgresql';
import { Order_Field, Paged_Order_Field } from '@src/data_struct/order';
import { Orders_Filter_Body_Field } from '@src/data_struct/order/body';

class QueryDB_Get_Orders {
    private _orders_filter_body: Orders_Filter_Body_Field | undefined;

    set_Orders_Filter_Body(orders_filter_body: Orders_Filter_Body_Field): void {
        this._orders_filter_body = orders_filter_body;
    }

    async run(): Promise<Paged_Order_Field | void> {
        if (this._orders_filter_body !== undefined) {
            const uuid = this._orders_filter_body.uuid ? this._orders_filter_body.uuid : null;
            const money_from = this._orders_filter_body.money_from ? this._orders_filter_body.money_from : null;
            const money_to = this._orders_filter_body.money_to ? this._orders_filter_body.money_to : null;
            const is_pay = this._orders_filter_body.is_pay !== undefined ? this._orders_filter_body.is_pay : null;
            const phone = this._orders_filter_body.phone ? this._orders_filter_body.phone : null;
            const is_delete =
                this._orders_filter_body.is_delete !== undefined ? this._orders_filter_body.is_delete : null;

            try {
                const result = await pool.query<{
                    items: Order_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_orders($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [
                    this._orders_filter_body.page,
                    this._orders_filter_body.size,
                    this._orders_filter_body.chat_room_id,
                    this._orders_filter_body.account_id,
                    uuid,
                    money_from,
                    money_to,
                    is_pay,
                    phone,
                    is_delete,
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

export default QueryDB_Get_Orders;

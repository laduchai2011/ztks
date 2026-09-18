import { pool } from '@src/connect/postgresql';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Get_Voucher_With_Order_Id_Body_Field } from '@src/data_struct/voucher/body';

class QueryDB_Get_Voucher_With_Order_Id {
    private _get_voucher_with_order_id_body: Get_Voucher_With_Order_Id_Body_Field | undefined;

    set_Get_Voucher_With_Order_Id_Body(get_voucher_with_order_id_body: Get_Voucher_With_Order_Id_Body_Field): void {
        this._get_voucher_with_order_id_body = get_voucher_with_order_id_body;
    }

    async run(): Promise<Voucher_Field | void> {
        if (this._get_voucher_with_order_id_body !== undefined) {
            try {
                const result = await pool.query<Voucher_Field>(`SELECT * FROM get_voucher_with_order_id($1);`, [
                    this._get_voucher_with_order_id_body.order_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Voucher_With_Order_Id;

import { pool } from '@src/connect/postgresql';
import { Shop_Pay_Field } from '@src/data_struct/shop';
import { Get_Latest_Shop_Pay_With_Shop_Id_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Latest_Shop_Pay_With_Shop_Id {
    private _get_latest_shop_pay_with_shop_id_body: Get_Latest_Shop_Pay_With_Shop_Id_Body_Field | undefined;

    set_Get_Latest_Shop_Pay_With_Shop_Id_Body(
        get_latest_shop_pay_with_shop_id_body: Get_Latest_Shop_Pay_With_Shop_Id_Body_Field
    ): void {
        this._get_latest_shop_pay_with_shop_id_body = get_latest_shop_pay_with_shop_id_body;
    }

    async run(): Promise<Shop_Pay_Field | void> {
        if (this._get_latest_shop_pay_with_shop_id_body !== undefined) {
            try {
                const result = await pool.query<Shop_Pay_Field>(
                    'SELECT * FROM get_latest_shop_pay_with_shop_id($1::UUID, $2::UUID)',
                    [
                        this._get_latest_shop_pay_with_shop_id_body.shop_id,
                        this._get_latest_shop_pay_with_shop_id_body.account_id,
                    ]
                );

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Latest_Shop_Pay_With_Shop_Id;

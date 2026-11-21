import { pool } from '@src/connect/postgresql';
import { Product_Total_Field } from '@src/data_struct/product';
import { Get_Product_Total_Body_Field } from '@src/data_struct/product/body';

class QueryDB_Get_Product_Total {
    private _get_product_total_body: Get_Product_Total_Body_Field | undefined;

    set_Get_Product_Total_Body(get_product_total_body: Get_Product_Total_Body_Field): void {
        this._get_product_total_body = get_product_total_body;
    }

    async run(): Promise<Product_Total_Field | void> {
        if (this._get_product_total_body !== undefined) {
            try {
                const result = await pool.query<Product_Total_Field>('SELECT * FROM get_product_total($1::UUID)', [
                    this._get_product_total_body.admin_account_id,
                ]);

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}

export default QueryDB_Get_Product_Total;

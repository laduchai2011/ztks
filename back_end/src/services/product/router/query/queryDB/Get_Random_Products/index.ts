import { pool } from '@src/connect/postgresql';
import { Cursor_Product_Field } from '@src/data_struct/product';
import { Get_Random_Products_Body_Field } from '@src/data_struct/product/body';

class QueryDB_Get_Random_Products {
    private _get_random_products_body: Get_Random_Products_Body_Field | undefined;

    set_Get_Random_Products_Body_Field(get_random_products_body: Get_Random_Products_Body_Field): void {
        this._get_random_products_body = get_random_products_body;
    }

    async run(): Promise<Cursor_Product_Field | void> {
        if (this._get_random_products_body !== undefined) {
            try {
                const result = await pool.query<{ get_random_products: Cursor_Product_Field }>(
                    'SELECT * FROM get_random_products($1::UUID, $2::UUID, $3, $4, $5)',
                    [
                        this._get_random_products_body.account_id,
                        this._get_random_products_body.seed,
                        this._get_random_products_body.is_delete,
                        this._get_random_products_body.limit,
                        this._get_random_products_body.cursor,
                    ]
                );

                if (result.rows.length > 0) {
                    return result.rows[0].get_random_products;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Random_Products;

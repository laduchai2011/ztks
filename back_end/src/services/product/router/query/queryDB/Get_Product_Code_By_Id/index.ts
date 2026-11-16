import { pool } from '@src/connect/postgresql';
import { Product_Code_Field } from '@src/data_struct/product';
import { Get_Product_Code_By_Id_Body_Field } from '@src/data_struct/product/body';

class QueryDB_Get_Product_Code_By_Id {
    private _get_product_code_by_id_body: Get_Product_Code_By_Id_Body_Field | undefined;

    set_Get_Product_Code_By_Id_Body(get_product_code_by_id_body: Get_Product_Code_By_Id_Body_Field): void {
        this._get_product_code_by_id_body = get_product_code_by_id_body;
    }

    async run(): Promise<Product_Code_Field | void> {
        if (this._get_product_code_by_id_body !== undefined) {
            try {
                const result = await pool.query<Product_Code_Field>('SELECT * FROM get_product_code_by_id($1::UUID)', [
                    this._get_product_code_by_id_body.id,
                ]);

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Product_Code_By_Id;

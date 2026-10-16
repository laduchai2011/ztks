import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/data_struct/shop';
import { Get_Shop_By_Id_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Shop_By_Id {
    private _get_shop_by_id_body: Get_Shop_By_Id_Body_Field | undefined;

    set_Get_Shop_By_Id_Body(get_shop_by_id_body: Get_Shop_By_Id_Body_Field): void {
        this._get_shop_by_id_body = get_shop_by_id_body;
    }

    async run(): Promise<Shop_Field | void> {
        if (this._get_shop_by_id_body !== undefined) {
            try {
                const result = await pool.query<Shop_Field>('SELECT * FROM get_shop_by_id($1::UUID)', [
                    this._get_shop_by_id_body.id,
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

export default QueryDB_Get_Shop_By_Id;

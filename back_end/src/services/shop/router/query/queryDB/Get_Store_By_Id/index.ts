import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Get_Store_By_Id_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Store_By_Id {
    private _get_store_by_id_body: Get_Store_By_Id_Body_Field | undefined;

    set_Get_Store_By_Id_Body(get_store_by_id_body: Get_Store_By_Id_Body_Field): void {
        this._get_store_by_id_body = get_store_by_id_body;
    }

    async run(): Promise<Store_Field | void> {
        if (this._get_store_by_id_body !== undefined) {
            try {
                const result = await pool.query<Store_Field>('SELECT * FROM get_store_by_id($1::UUID)', [
                    this._get_store_by_id_body.id,
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

export default QueryDB_Get_Store_By_Id;

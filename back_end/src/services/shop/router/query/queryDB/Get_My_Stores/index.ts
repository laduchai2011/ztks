import { pool } from '@src/connect/postgresql';
import { Cursor_Store_Field } from '@src/data_struct/shop';
import { Get_My_Stores_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_My_Stores {
    private _get_my_stores_body: Get_My_Stores_Body_Field | undefined;

    set_Get_My_Stores_Body(get_my_stores_body: Get_My_Stores_Body_Field): void {
        this._get_my_stores_body = get_my_stores_body;
    }

    async run(): Promise<Cursor_Store_Field | void> {
        if (this._get_my_stores_body !== undefined) {
            const cursor = this._get_my_stores_body.cursor ? this._get_my_stores_body.cursor : null;

            try {
                const result = await pool.query<Cursor_Store_Field>(
                    'SELECT * FROM get_my_stores($1, $2::UUID, $3::UUID)',
                    [this._get_my_stores_body.limit, cursor, this._get_my_stores_body.depot_id]
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

export default QueryDB_Get_My_Stores;

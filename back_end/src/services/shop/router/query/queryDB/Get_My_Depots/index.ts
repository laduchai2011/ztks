import { pool } from '@src/connect/postgresql';
import { Cursor_Depot_Field } from '@src/data_struct/shop';
import { Get_My_Depots_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_My_Depots {
    private _get_my_depots_body: Get_My_Depots_Body_Field | undefined;

    set_Get_My_Depots_Body(get_my_depots_body: Get_My_Depots_Body_Field): void {
        this._get_my_depots_body = get_my_depots_body;
    }

    async run(): Promise<Cursor_Depot_Field | void> {
        if (this._get_my_depots_body !== undefined) {
            const cursor = this._get_my_depots_body.cursor ? this._get_my_depots_body.cursor : null;

            try {
                const result = await pool.query<Cursor_Depot_Field>(
                    'SELECT * FROM get_my_depots($1, $2::UUID, $3::UUID)',
                    [this._get_my_depots_body.limit, cursor, this._get_my_depots_body.shop_id]
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

export default QueryDB_Get_My_Depots;

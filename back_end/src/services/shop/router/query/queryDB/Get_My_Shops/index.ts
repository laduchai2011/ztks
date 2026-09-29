import { pool } from '@src/connect/postgresql';
import { Cursor_Shop_Field } from '@src/data_struct/shop';
import { Get_My_Shops_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_My_Shops {
    private _get_my_shops_body: Get_My_Shops_Body_Field | undefined;

    set_Get_My_Shops_Body(get_my_shops_body: Get_My_Shops_Body_Field): void {
        this._get_my_shops_body = get_my_shops_body;
    }

    async run(): Promise<Cursor_Shop_Field | void> {
        if (this._get_my_shops_body !== undefined) {
            const cursor = this._get_my_shops_body.cursor ? this._get_my_shops_body.cursor : null;

            try {
                const result = await pool.query<Cursor_Shop_Field>(
                    'SELECT * FROM get_my_shops($1, $2::UUID, $3::UUID)',
                    [this._get_my_shops_body.limit, cursor, this._get_my_shops_body.account_id]
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

export default QueryDB_Get_My_Shops;

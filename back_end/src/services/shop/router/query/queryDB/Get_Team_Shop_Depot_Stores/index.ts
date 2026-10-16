import { pool } from '@src/connect/postgresql';
import { Cursor_Team_Shop_Depot_Store_Field } from '@src/data_struct/shop';
import { Get_Team_Shop_Depot_Stores_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Team_Shop_Depot_Stores {
    private _get_team_shop_depot_stores_body: Get_Team_Shop_Depot_Stores_Body_Field | undefined;

    set_Get_Team_Shop_Depot_Stores_Body(get_team_shop_depot_stores_body: Get_Team_Shop_Depot_Stores_Body_Field): void {
        this._get_team_shop_depot_stores_body = get_team_shop_depot_stores_body;
    }

    async run(): Promise<Cursor_Team_Shop_Depot_Store_Field | void> {
        if (this._get_team_shop_depot_stores_body !== undefined) {
            const cursor = this._get_team_shop_depot_stores_body.cursor
                ? this._get_team_shop_depot_stores_body.cursor
                : null;

            try {
                const result = await pool.query<{ get_team_shop_depot_stores: Cursor_Team_Shop_Depot_Store_Field }>(
                    'SELECT * FROM get_team_shop_depot_stores($1::UUID, $2, $3::UUID)',
                    [
                        this._get_team_shop_depot_stores_body.team_shop_depot_id,
                        this._get_team_shop_depot_stores_body.limit,
                        cursor,
                    ]
                );

                if (result.rows.length > 0) {
                    return result.rows[0].get_team_shop_depot_stores;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Team_Shop_Depot_Stores;

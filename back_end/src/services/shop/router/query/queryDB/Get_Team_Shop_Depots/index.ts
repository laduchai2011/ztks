import { pool } from '@src/connect/postgresql';
import { Cursor_Team_Shop_Depot_Field } from '@src/data_struct/shop';
import { Get_Team_Shop_Depots_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Team_Shop_Depots {
    private _get_team_shop_depots_body: Get_Team_Shop_Depots_Body_Field | undefined;

    set_Get_Team_Shop_Depots_Body(get_team_shop_depots_body: Get_Team_Shop_Depots_Body_Field): void {
        this._get_team_shop_depots_body = get_team_shop_depots_body;
    }

    async run(): Promise<Cursor_Team_Shop_Depot_Field | void> {
        if (this._get_team_shop_depots_body !== undefined) {
            const cursor = this._get_team_shop_depots_body.cursor ? this._get_team_shop_depots_body.cursor : null;

            try {
                const result = await pool.query<{ get_team_shop_depots: Cursor_Team_Shop_Depot_Field }>(
                    'SELECT * FROM get_team_shop_depots($1::UUID, $2, $3::UUID)',
                    [this._get_team_shop_depots_body.team_shop_id, this._get_team_shop_depots_body.limit, cursor]
                );

                if (result.rows.length > 0) {
                    return result.rows[0].get_team_shop_depots;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Team_Shop_Depots;

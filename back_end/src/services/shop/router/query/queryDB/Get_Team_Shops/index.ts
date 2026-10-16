import { pool } from '@src/connect/postgresql';
import { Cursor_Team_Shop_Field } from '@src/data_struct/shop';
import { Get_Team_Shops_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Team_Shops {
    private _get_team_shops_body: Get_Team_Shops_Body_Field | undefined;

    set_Get_Team_Shops_Body(get_team_shops_body: Get_Team_Shops_Body_Field): void {
        this._get_team_shops_body = get_team_shops_body;
    }

    async run(): Promise<Cursor_Team_Shop_Field | void> {
        if (this._get_team_shops_body !== undefined) {
            const cursor = this._get_team_shops_body.cursor ? this._get_team_shops_body.cursor : null;

            try {
                const result = await pool.query<{ get_team_shops: Cursor_Team_Shop_Field }>(
                    'SELECT * FROM get_team_shops($1::UUID, $2, $3::UUID)',
                    [this._get_team_shops_body.team_id, this._get_team_shops_body.limit, cursor]
                );

                if (result.rows.length > 0) {
                    return result.rows[0].get_team_shops;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Team_Shops;

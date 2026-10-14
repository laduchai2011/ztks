import { pool } from '@src/connect/postgresql';
import { Team_Shop_Depot_Field } from '@src/data_struct/shop';
import { Add_Team_Shop_Depot_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Add_Team_Shop_Depot {
    private _add_team_shop_depot_body: Add_Team_Shop_Depot_Body_Field | undefined;

    set_Add_Team_Shop_Depot_Body(add_team_shop_depot_body: Add_Team_Shop_Depot_Body_Field): void {
        this._add_team_shop_depot_body = add_team_shop_depot_body;
    }

    async run(): Promise<Team_Shop_Depot_Field | undefined> {
        if (this._add_team_shop_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Shop_Depot_Field>(
                    'SELECT * FROM add_team_shop_depot($1::UUID, $2::UUID, $3::UUID)',
                    [
                        this._add_team_shop_depot_body.team_shop_id,
                        this._add_team_shop_depot_body.depot_id,
                        this._add_team_shop_depot_body.admin_account_id,
                    ]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error('PostgreSQL error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Add_Team_Shop_Depot;

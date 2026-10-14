import { pool } from '@src/connect/postgresql';
import { Depot_Role_Statistics_Field } from '@src/data_struct/shop';
import { Get_Depot_Role_Statistics_For_One_Team_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Depot_Role_Statistics_For_One_Team {
    private _get_depot_role_statistics_for_one_team_body: Get_Depot_Role_Statistics_For_One_Team_Body_Field | undefined;

    set_Get_Depot_Role_Statistics_For_One_Team_Body(
        get_depot_role_statistics_for_one_team_body: Get_Depot_Role_Statistics_For_One_Team_Body_Field
    ): void {
        this._get_depot_role_statistics_for_one_team_body = get_depot_role_statistics_for_one_team_body;
    }

    async run(): Promise<Depot_Role_Statistics_Field | void> {
        if (this._get_depot_role_statistics_for_one_team_body !== undefined) {
            try {
                const result = await pool.query<Depot_Role_Statistics_Field>(
                    'SELECT * FROM get_shop_role_statistics_for_one_team($1::UUID, $2::UUID, $3)',
                    [
                        this._get_depot_role_statistics_for_one_team_body.team_id,
                        this._get_depot_role_statistics_for_one_team_body.depot_id,
                        this._get_depot_role_statistics_for_one_team_body.type,
                    ]
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

export default QueryDB_Get_Depot_Role_Statistics_For_One_Team;

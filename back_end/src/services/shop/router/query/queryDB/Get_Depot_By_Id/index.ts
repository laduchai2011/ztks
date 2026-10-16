import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Get_Depot_By_Id_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Depot_By_Id {
    private _get_depot_by_id_body: Get_Depot_By_Id_Body_Field | undefined;

    set_Get_Depot_By_Id_Body(get_depot_by_id_body: Get_Depot_By_Id_Body_Field): void {
        this._get_depot_by_id_body = get_depot_by_id_body;
    }

    async run(): Promise<Depot_Field | void> {
        if (this._get_depot_by_id_body !== undefined) {
            try {
                const result = await pool.query<Depot_Field>('SELECT * FROM get_depot_by_id($1::UUID)', [
                    this._get_depot_by_id_body.id,
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

export default QueryDB_Get_Depot_By_Id;

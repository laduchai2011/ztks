import { pool } from '@src/connect/postgresql';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';
import { Get_Statistics_Oa_Body_Field } from '@src/data_struct/statistics/body';

class QueryDB_Get_Statistics_Oa {
    private _get_statistics_oa_body: Get_Statistics_Oa_Body_Field | undefined;

    set_Get_Statistics_Oa_Body(get_statistics_oa_body: Get_Statistics_Oa_Body_Field): void {
        this._get_statistics_oa_body = get_statistics_oa_body;
    }

    async run(): Promise<Statistics_Oa_Field[] | undefined> {
        if (this._get_statistics_oa_body !== undefined) {
            try {
                const result = await pool.query<Statistics_Oa_Field>(`SELECT * FROM get_statistics_oa($1, $2, $3);`, [
                    this._get_statistics_oa_body.from_date,
                    this._get_statistics_oa_body.to_date,
                    this._get_statistics_oa_body.zalo_oa_id,
                ]);

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Statistics_Oa;

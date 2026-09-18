import { pool } from '@src/connect/postgresql';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';
import { Update_Statistics_Body_Field } from '@src/data_struct/statistics/body';

class MutateDB_Update_Statistics {
    private _update_statistics_body: Update_Statistics_Body_Field | undefined;

    set_Update_Statistics_Body(update_statistics_body: Update_Statistics_Body_Field): void {
        this._update_statistics_body = update_statistics_body;
    }

    async run(): Promise<Statistics_Oa_Field | undefined> {
        if (this._update_statistics_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Statistics_Oa_Field>(
                    `SELECT * FROM update_statistics($1, $2, $3, $4);`,
                    [
                        this._update_statistics_body.sales,
                        this._update_statistics_body.zalo_oa_id,
                        this._update_statistics_body.account_id,
                        this._update_statistics_body.of_day,
                    ]
                );

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Update_Statistics;

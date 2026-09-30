import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Delete_Depot_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Delete_Depot {
    private _delete_depot_body: Delete_Depot_Body_Field | undefined;

    set_Delete_Depot_Body(delete_depot_body: Delete_Depot_Body_Field): void {
        this._delete_depot_body = delete_depot_body;
    }

    async run(): Promise<Depot_Field | undefined> {
        if (this._delete_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Depot_Field>('SELECT * FROM delete_depot($1::UUID, $2::UUID)', [
                    this._delete_depot_body.id,
                    this._delete_depot_body.account_id,
                ]);

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

export default MutateDB_Delete_Depot;

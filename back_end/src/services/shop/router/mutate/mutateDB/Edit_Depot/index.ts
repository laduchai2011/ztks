import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Edit_Depot_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Edit_Depot {
    private _edit_depot_body: Edit_Depot_Body_Field | undefined;

    set_Edit_Depot_Body(edit_depot_body: Edit_Depot_Body_Field): void {
        this._edit_depot_body = edit_depot_body;
    }

    async run(): Promise<Depot_Field | undefined> {
        if (this._edit_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Depot_Field>(
                    'SELECT * FROM edit_depot($1::UUID, $2, $3, $4, $5, $6, $7::UUID)',
                    [
                        this._edit_depot_body.id,
                        this._edit_depot_body.name,
                        this._edit_depot_body.description,
                        this._edit_depot_body.content,
                        this._edit_depot_body.address,
                        this._edit_depot_body.phone,
                        this._edit_depot_body.account_id,
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

export default MutateDB_Edit_Depot;

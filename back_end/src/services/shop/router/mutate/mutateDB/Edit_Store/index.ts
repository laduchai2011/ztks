import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Edit_Store_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Edit_Store {
    private _edit_store_body: Edit_Store_Body_Field | undefined;

    set_Edit_Store_Body(edit_store_body: Edit_Store_Body_Field): void {
        this._edit_store_body = edit_store_body;
    }

    async run(): Promise<Store_Field | undefined> {
        if (this._edit_store_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Store_Field>(
                    'SELECT * FROM edit_store($1::UUID, $2, $3, $4, $5::UUID)',
                    [
                        this._edit_store_body.id,
                        this._edit_store_body.name,
                        this._edit_store_body.description,
                        this._edit_store_body.content,
                        this._edit_store_body.account_id,
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

export default MutateDB_Edit_Store;

import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Create_Store_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Create_Store {
    private _create_store_body: Create_Store_Body_Field | undefined;

    set_Create_Store_Body(create_store_body: Create_Store_Body_Field): void {
        this._create_store_body = create_store_body;
    }

    async run(): Promise<Store_Field | undefined> {
        if (this._create_store_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Store_Field>(
                    'SELECT * FROM create_store($1, $2, $3, $4::UUID, $5::UUID)',
                    [
                        this._create_store_body.name,
                        this._create_store_body.description,
                        this._create_store_body.content,
                        this._create_store_body.depot_id,
                        this._create_store_body.account_id,
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

export default MutateDB_Create_Store;

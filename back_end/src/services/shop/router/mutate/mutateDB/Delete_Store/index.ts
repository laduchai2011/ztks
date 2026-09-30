import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Delete_Store_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Delete_Store {
    private _delete_store_body: Delete_Store_Body_Field | undefined;

    set_Delete_Store_Body(delete_store_body: Delete_Store_Body_Field): void {
        this._delete_store_body = delete_store_body;
    }

    async run(): Promise<Store_Field | undefined> {
        if (this._delete_store_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Store_Field>('SELECT * FROM edit_store($1::UUID, $2::UUID)', [
                    this._delete_store_body.id,
                    this._delete_store_body.account_id,
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

export default MutateDB_Delete_Store;

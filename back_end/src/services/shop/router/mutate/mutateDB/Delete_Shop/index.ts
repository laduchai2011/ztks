import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/data_struct/shop';
import { Delete_Shop_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Delete_Shop {
    private _delete_shop_body: Delete_Shop_Body_Field | undefined;

    set_Delete_Shop_Body(delete_shop_body: Delete_Shop_Body_Field): void {
        this._delete_shop_body = delete_shop_body;
    }

    async run(): Promise<Shop_Field | undefined> {
        if (this._delete_shop_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Shop_Field>('SELECT * FROM delete_shop($1::UUID, $2::UUID)', [
                    this._delete_shop_body.id,
                    this._delete_shop_body.account_id,
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

export default MutateDB_Delete_Shop;

import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/data_struct/shop';
import { Create_Shop_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Create_Shop {
    private _create_shop_body: Create_Shop_Body_Field | undefined;

    set_Create_Shop_Body(create_shop_body: Create_Shop_Body_Field): void {
        this._create_shop_body = create_shop_body;
    }

    async run(): Promise<Shop_Field | undefined> {
        if (this._create_shop_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Shop_Field>('SELECT * FROM create_shop($1, $2, $3, $4, $5, $6::UUID)', [
                    this._create_shop_body.name,
                    this._create_shop_body.description,
                    this._create_shop_body.content,
                    this._create_shop_body.address,
                    this._create_shop_body.phone,
                    this._create_shop_body.account_id,
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

export default MutateDB_Create_Shop;

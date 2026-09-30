import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/data_struct/shop';
import { Edit_Shop_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Edit_Shop {
    private _edit_shop_body: Edit_Shop_Body_Field | undefined;

    set_Edit_Shop_Body(edit_shop_body: Edit_Shop_Body_Field): void {
        this._edit_shop_body = edit_shop_body;
    }

    async run(): Promise<Shop_Field | undefined> {
        if (this._edit_shop_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Shop_Field>(
                    'SELECT * FROM edit_shop($1::UUID, $2, $3, $4, $5, $6, $7::UUID)',
                    [
                        this._edit_shop_body.id,
                        this._edit_shop_body.name,
                        this._edit_shop_body.description,
                        this._edit_shop_body.content,
                        this._edit_shop_body.address,
                        this._edit_shop_body.phone,
                        this._edit_shop_body.account_id,
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

export default MutateDB_Edit_Shop;

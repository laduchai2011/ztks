import { pool } from '@src/connect/postgresql';
import { Product_Code_Field } from '@src/data_struct/product';
import { Create_Product_Code_Body_Field } from '@src/data_struct/product/body';

class MutateDB_Create_Product_Code {
    private _create_product_code_body: Create_Product_Code_Body_Field | undefined;

    set_Create_Product_Code_Body(create_product_code_body: Create_Product_Code_Body_Field): void {
        this._create_product_code_body = create_product_code_body;
    }

    async run(): Promise<Product_Code_Field | undefined> {
        if (this._create_product_code_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Product_Code_Field>(
                    'SELECT * FROM create_product_code($1, $2, $3, $4, $5::JSONB, $6::JSONB)',
                    [
                        this._create_product_code_body.name,
                        this._create_product_code_body.description,
                        this._create_product_code_body.detail,
                        this._create_product_code_body.account_id,
                        this._create_product_code_body.images,
                        this._create_product_code_body.videos,
                    ]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Create_Product_Code error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Product_Code;

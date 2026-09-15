import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/dataStruct/shop';
import { Create_Shop_Body_Field } from '@src/dataStruct/shop/body';

class MutateDB_Create_Shop {
    private _create_shop_body: Create_Shop_Body_Field | undefined;

    constructor() {}

    set_Create_Shop_Body(create_shop_body: Create_Shop_Body_Field): void {
        this._create_shop_body = create_shop_body;
    }

    async run() {
        if (this._create_shop_body !== undefined) {
            try {
                const result = await pool.query(`SELECT * FROM Create_Shop($1, $2, $3, $4, $5, $6);`, [
                    this._create_shop_body.p_name,
                    this._create_shop_body.p_description,
                    this._create_shop_body.p_content,
                    this._create_shop_body.p_address,
                    this._create_shop_body.p_phone,
                    this._create_shop_body.p_account_id,
                ]);

                console.log(1111, result);

                return result.rows;
            } catch (error) {
                console.error('PostgreSQL error:', error);
                throw error;
            }
        }
    }
}

export default MutateDB_Create_Shop;

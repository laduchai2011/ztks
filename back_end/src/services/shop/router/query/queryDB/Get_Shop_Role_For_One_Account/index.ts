import { pool } from '@src/connect/postgresql';
import { Shop_Role_Field } from '@src/data_struct/shop';
import { Get_Shop_Role_For_One_Account_Body_Field } from '@src/data_struct/shop/body';

class QueryDB_Get_Shop_Role_For_One_Account {
    private _get_shop_role_for_one_account_body: Get_Shop_Role_For_One_Account_Body_Field | undefined;

    set_Get_Shop_Role_For_One_Account_Body(
        get_shop_role_for_one_account_body: Get_Shop_Role_For_One_Account_Body_Field
    ): void {
        this._get_shop_role_for_one_account_body = get_shop_role_for_one_account_body;
    }

    async run(): Promise<Shop_Role_Field | void> {
        if (this._get_shop_role_for_one_account_body !== undefined) {
            try {
                const result = await pool.query<Shop_Role_Field>(
                    'SELECT * FROM get_shop_role_for_one_account($1::UUID, $2::UUID, $3)',
                    [
                        this._get_shop_role_for_one_account_body.account_id,
                        this._get_shop_role_for_one_account_body.shop_id,
                        this._get_shop_role_for_one_account_body.type,
                    ]
                );

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Shop_Role_For_One_Account;

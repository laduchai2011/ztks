import { pool } from '@src/connect/postgresql';
import { Shop_Role_Field } from '@src/data_struct/shop';
import { Leader_Set_Shop_Role_For_One_Account_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Leader_Set_Shop_Role_For_One_Account {
    private _leader_set_shop_role_for_one_account_body: Leader_Set_Shop_Role_For_One_Account_Body_Field | undefined;

    set_Leader_Set_Shop_Role_For_One_Account_Body(
        leader_set_shop_role_for_one_account_body: Leader_Set_Shop_Role_For_One_Account_Body_Field
    ): void {
        this._leader_set_shop_role_for_one_account_body = leader_set_shop_role_for_one_account_body;
    }

    async run(): Promise<Shop_Role_Field | undefined> {
        if (this._leader_set_shop_role_for_one_account_body !== undefined) {
            console.log(111111, this._leader_set_shop_role_for_one_account_body);
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Shop_Role_Field>(
                    'SELECT * FROM leader_set_shop_role_for_one_account($1, $2, $3::UUID, $4::UUID, $5::UUID)',
                    [
                        this._leader_set_shop_role_for_one_account_body.type,
                        this._leader_set_shop_role_for_one_account_body.is_lock,
                        this._leader_set_shop_role_for_one_account_body.shop_id,
                        this._leader_set_shop_role_for_one_account_body.account_id,
                        this._leader_set_shop_role_for_one_account_body.leader_account_id,
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

export default MutateDB_Leader_Set_Shop_Role_For_One_Account;

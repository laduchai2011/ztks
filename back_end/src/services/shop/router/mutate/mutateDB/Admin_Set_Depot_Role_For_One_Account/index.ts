import { pool } from '@src/connect/postgresql';
import { Depot_Role_Field } from '@src/data_struct/shop';
import { Admin_Set_Depot_Role_For_One_Account_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Admin_Set_Depot_Role_For_One_Account {
    private _admin_set_depot_role_for_one_account_body: Admin_Set_Depot_Role_For_One_Account_Body_Field | undefined;

    set_Admin_Set_Depot_Role_For_One_Account_Body(
        admin_set_depot_role_for_one_account_body: Admin_Set_Depot_Role_For_One_Account_Body_Field
    ): void {
        this._admin_set_depot_role_for_one_account_body = admin_set_depot_role_for_one_account_body;
    }

    async run(): Promise<Depot_Role_Field | undefined> {
        if (this._admin_set_depot_role_for_one_account_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Depot_Role_Field>(
                    'SELECT * FROM admin_set_depot_role_for_one_account($1, $2, $3::UUID, $4::UUID, $5::UUID)',
                    [
                        this._admin_set_depot_role_for_one_account_body.type,
                        this._admin_set_depot_role_for_one_account_body.is_lock,
                        this._admin_set_depot_role_for_one_account_body.depot_id,
                        this._admin_set_depot_role_for_one_account_body.account_id,
                        this._admin_set_depot_role_for_one_account_body.admin_account_id,
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

export default MutateDB_Admin_Set_Depot_Role_For_One_Account;

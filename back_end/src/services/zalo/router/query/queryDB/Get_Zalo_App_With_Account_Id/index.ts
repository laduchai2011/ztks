import { pool } from '@src/connect/postgresql';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { Get_Zalo_App_With_Account_Id_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zalo_App_With_Account_Id {
    private _zalo_app_with_account_id_body: Get_Zalo_App_With_Account_Id_Body_Field | undefined;

    set_Get_Zalo_App_With_Account_Id_Body(
        zalo_app_with_account_id_body: Get_Zalo_App_With_Account_Id_Body_Field
    ): void {
        this._zalo_app_with_account_id_body = zalo_app_with_account_id_body;
    }

    async run(): Promise<Zalo_App_Field | void> {
        if (this._zalo_app_with_account_id_body !== undefined) {
            try {
                const result = await pool.query<Zalo_App_Field>(`SELECT * FROM get_zalo_app_with_account_id($1);`, [
                    this._zalo_app_with_account_id_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Zalo_App_With_Account_Id;

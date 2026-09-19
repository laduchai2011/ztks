import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Check_Zalo_Oa_List_With_Zalo_App_Id {
    private _check_zalo_oa_list_with_zalo_app_id_body: Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field | undefined;

    set_Check_Zalo_Oa_List_With_Zalo_App_Id_Body(
        check_zalo_oa_list_with_zalo_app_id_body: Check_Zalo_Oa_List_With_Zalo_App_Id_Body_Field
    ): void {
        this._check_zalo_oa_list_with_zalo_app_id_body = check_zalo_oa_list_with_zalo_app_id_body;
    }

    async run(): Promise<Zalo_Oa_Field[] | void> {
        if (this._check_zalo_oa_list_with_zalo_app_id_body !== undefined) {
            try {
                const result = await pool.query<Zalo_Oa_Field>(`SELECT * FROM check_zalo_app_with_app_id($1);`, [
                    this._check_zalo_oa_list_with_zalo_app_id_body.zalo_app_id,
                ]);

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Check_Zalo_Oa_List_With_Zalo_App_Id;

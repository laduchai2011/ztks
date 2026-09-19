import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_With_Id_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zalo_Oa_With_Id {
    private _get_zalo_oa_with_id_body: Get_Zalo_Oa_With_Id_Body_Field | undefined;

    set_Get_Zalo_Oa_With_Id_Body(get_zalo_oa_with_id_body: Get_Zalo_Oa_With_Id_Body_Field): void {
        this._get_zalo_oa_with_id_body = get_zalo_oa_with_id_body;
    }

    async run(): Promise<Zalo_Oa_Field | void> {
        if (this._get_zalo_oa_with_id_body !== undefined) {
            try {
                const result = await pool.query<Zalo_Oa_Field>(`SELECT * FROM get_zalo_oa_with_id($1, $2);`, [
                    this._get_zalo_oa_with_id_body.id,
                    this._get_zalo_oa_with_id_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Zalo_Oa_With_Id;

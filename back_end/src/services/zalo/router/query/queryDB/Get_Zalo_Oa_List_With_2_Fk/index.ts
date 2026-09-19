import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Field, Paged_Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_List_With_2_Fk_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zalo_Oa_List_With_2_Fk {
    private _get_zalo_oa_list_with_2_fk_body: Get_Zalo_Oa_List_With_2_Fk_Body_Field | undefined;

    set_Get_Zalo_Oa_List_With_2_Fk_Body(get_zalo_oa_list_with_2_fk_body: Get_Zalo_Oa_List_With_2_Fk_Body_Field): void {
        this._get_zalo_oa_list_with_2_fk_body = get_zalo_oa_list_with_2_fk_body;
    }

    async run(): Promise<Paged_Zalo_Oa_Field | void> {
        if (this._get_zalo_oa_list_with_2_fk_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Zalo_Oa_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_zalo_oa_list_with_2_fk($1, $2, $3, $4);`, [
                    this._get_zalo_oa_list_with_2_fk_body.page,
                    this._get_zalo_oa_list_with_2_fk_body.size,
                    this._get_zalo_oa_list_with_2_fk_body.zalo_app_id,
                    this._get_zalo_oa_list_with_2_fk_body.account_id,
                ]);

                const data: Paged_Zalo_Oa_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Zalo_Oa_List_With_2_Fk;

import { pool } from '@src/connect/postgresql';
import { Zns_Template_Field, Paged_Zns_Template_Field } from '@src/data_struct/zalo';
import { Get_Zns_Templates_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zns_Templates {
    private _get_zns_templates_body: Get_Zns_Templates_Body_Field | undefined;

    set_Get_Zns_Templates_Body(get_zns_templates_body: Get_Zns_Templates_Body_Field): void {
        this._get_zns_templates_body = get_zns_templates_body;
    }

    async run(): Promise<Paged_Zns_Template_Field | void> {
        if (this._get_zns_templates_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Zns_Template_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_zns_templates($1, $2, $3, $4, $5);`, [
                    this._get_zns_templates_body.page,
                    this._get_zns_templates_body.size,
                    this._get_zns_templates_body.offset,
                    this._get_zns_templates_body.zalo_oa_id,
                    this._get_zns_templates_body.account_id,
                ]);

                const data: Paged_Zns_Template_Field = {
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

export default QueryDB_Get_Zns_Templates;

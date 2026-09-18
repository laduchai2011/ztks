import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Token_Field } from '@src/data_struct/zalo';
import { Get_Zalo_Oa_Token_With_Fk_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zalo_Oa_Token_With_Fk {
    private _get_zalo_oa_token_with_fk_body: Get_Zalo_Oa_Token_With_Fk_Body_Field | undefined;

    set_Get_Zalo_Oa_Token_With_Fk_Body(get_zalo_oa_token_with_fk_body: Get_Zalo_Oa_Token_With_Fk_Body_Field): void {
        this._get_zalo_oa_token_with_fk_body = get_zalo_oa_token_with_fk_body;
    }

    async run(): Promise<Zalo_Oa_Token_Field | void> {
        if (this._get_zalo_oa_token_with_fk_body !== undefined) {
            try {
                const result = await pool.query<Zalo_Oa_Token_Field>(
                    `SELECT * FROM get_zalo_oa_token_with_fk($1, $2, $3);`,
                    [this._get_zalo_oa_token_with_fk_body.zalo_oa_id, this._get_zalo_oa_token_with_fk_body.account_id]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Zalo_Oa_Token_With_Fk;

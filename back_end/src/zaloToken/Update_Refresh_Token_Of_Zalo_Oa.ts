import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Token_Field } from '@src/data_struct/zalo';
import { Update_Refresh_Token_Of_Zalo_Oa_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Update_Refresh_Token_Of_Zalo_Oa {
    private _update_refresh_token_of_zalo_oa_body: Update_Refresh_Token_Of_Zalo_Oa_Body_Field | undefined;

    set_Update_Refresh_Token_Of_Zalo_Oa_Body(
        update_refresh_token_of_zalo_oa_body: Update_Refresh_Token_Of_Zalo_Oa_Body_Field
    ): void {
        this._update_refresh_token_of_zalo_oa_body = update_refresh_token_of_zalo_oa_body;
    }

    async run(): Promise<Zalo_Oa_Token_Field | void> {
        if (this._update_refresh_token_of_zalo_oa_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zalo_Oa_Token_Field>(
                    'SELECT * FROM update_refresh_token_of_zalo_oa($1, $2::UUID, $3::UUID)',
                    [
                        this._update_refresh_token_of_zalo_oa_body.refresh_token,
                        this._update_refresh_token_of_zalo_oa_body.zalo_oa_id,
                        this._update_refresh_token_of_zalo_oa_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Update_Refresh_Token_Of_Zalo_Oa;

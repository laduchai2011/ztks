import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Edit_Zalo_Oa_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Edit_Zalo_Oa {
    private _edit_zalo_oa_body: Edit_Zalo_Oa_Body_Field | undefined;

    set_Edit_Zalo_Oa_Body(edit_zalo_oa_body: Edit_Zalo_Oa_Body_Field): void {
        this._edit_zalo_oa_body = edit_zalo_oa_body;
    }

    async run(): Promise<Zalo_Oa_Field | void> {
        if (this._edit_zalo_oa_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zalo_Oa_Field>(
                    `SELECT * FROM create_zns_template($1, $2, $3, $4, $5, $6, $7);`,
                    [
                        this._edit_zalo_oa_body.id,
                        this._edit_zalo_oa_body.label,
                        this._edit_zalo_oa_body.oa_id,
                        this._edit_zalo_oa_body.oa_name,
                        this._edit_zalo_oa_body.oa_secret,
                        this._edit_zalo_oa_body.zalo_app_id,
                        this._edit_zalo_oa_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Zalo_Oa;

import { pool } from '@src/connect/postgresql';
import { Zns_Template_Field } from '@src/data_struct/zalo';
import { Edit_Zns_Template_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Edit_Zns_Template {
    private _edit_zns_template_body: Edit_Zns_Template_Body_Field | undefined;

    set_Edit_Zns_Template_Body(edit_zns_template_body: Edit_Zns_Template_Body_Field): void {
        this._edit_zns_template_body = edit_zns_template_body;
    }

    async run(): Promise<Zns_Template_Field | void> {
        if (this._edit_zns_template_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zns_Template_Field>(
                    `SELECT * FROM edit_zns_template($1, $2, $3, $4, $5, $6, $7, $8);`,
                    [
                        this._edit_zns_template_body.id,
                        this._edit_zns_template_body.tem_id,
                        this._edit_zns_template_body.images,
                        this._edit_zns_template_body.data_fields,
                        this._edit_zns_template_body.phone_cost,
                        this._edit_zns_template_body.uid_cost,
                        this._edit_zns_template_body.zalo_oa_id,
                        this._edit_zns_template_body.account_id,
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

export default MutateDB_Edit_Zns_Template;

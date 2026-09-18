import { pool } from '@src/connect/postgresql';
import { Zns_Template_Field } from '@src/data_struct/zalo';
import { Create_Zns_Template_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Create_Zns_Template {
    private _create_zns_template_body: Create_Zns_Template_Body_Field | undefined;

    set_Create_Zns_Template_Body(create_zns_template_body: Create_Zns_Template_Body_Field): void {
        this._create_zns_template_body = create_zns_template_body;
    }

    async run(): Promise<Zns_Template_Field | void> {
        if (this._create_zns_template_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zns_Template_Field>(
                    `SELECT * FROM create_zns_template($1, $2, $3, $4, $5, $6, $7);`,
                    [
                        this._create_zns_template_body.tem_id,
                        this._create_zns_template_body.images,
                        this._create_zns_template_body.data_fields,
                        this._create_zns_template_body.phone_cost,
                        this._create_zns_template_body.uid_cost,
                        this._create_zns_template_body.zalo_oa_id,
                        this._create_zns_template_body.account_id,
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

export default MutateDB_Create_Zns_Template;

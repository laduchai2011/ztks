import { pool } from '@src/connect/postgresql';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Create_Zalo_Oa_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Create_Zalo_Oa {
    private _create_zalo_oa_body: Create_Zalo_Oa_Body_Field | undefined;

    set_Create_Zalo_Oa_Body(create_zalo_oa_body: Create_Zalo_Oa_Body_Field): void {
        this._create_zalo_oa_body = create_zalo_oa_body;
    }

    async run(): Promise<Zalo_Oa_Field | void> {
        if (this._create_zalo_oa_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zalo_Oa_Field>(
                    `SELECT * FROM create_zalo_oa($1, $2, $3, $4, $5, $6);`,
                    [
                        this._create_zalo_oa_body.label,
                        this._create_zalo_oa_body.oa_id,
                        this._create_zalo_oa_body.oa_name,
                        this._create_zalo_oa_body.oa_secret,
                        this._create_zalo_oa_body.zalo_app_id,
                        this._create_zalo_oa_body.account_id,
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

export default MutateDB_Create_Zalo_Oa;

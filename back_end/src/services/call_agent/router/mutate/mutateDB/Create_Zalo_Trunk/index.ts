import { pool } from '@src/connect/postgresql';
import { Zalo_Trunk_Field } from '@src/dataStruct/call_agent';
import { Create_Zalo_Trunk_Body_Field } from '@src/dataStruct/call_agent/body';

class MutateDB_Create_Zalo_Trunk {
   
    private _create_zalo_trunk_body: Create_Zalo_Trunk_Body_Field | undefined;

    set_Create_Zalo_Trunk_Body(create_zalo_trunk_body: Create_Zalo_Trunk_Body_Field): void {
        this._create_zalo_trunk_body = create_zalo_trunk_body;
    }

    async run(): Promise<Zalo_Trunk_Field | undefined> {
        if (this._create_zalo_trunk_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');
                                                
                const result = await pool.query<Zalo_Trunk_Field>(`SELECT * FROM create_zalo_trunk($1, $2, $3, $4, $5);`, [
                    this._create_zalo_trunk_body.trunk_code,
                    this._create_zalo_trunk_body.app_id,
                    this._create_zalo_trunk_body.oa_id,
                    this._create_zalo_trunk_body.port,
                    this._create_zalo_trunk_body.account_id
                ]);

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

export default MutateDB_Create_Zalo_Trunk;

import { pool } from '@src/connect/postgresql';
import { Call_PerMit_Field } from '@src/data_struct/call_agent';
import { Create_Call_Permit_Body_Field } from '@src/data_struct/call_agent/body';

class MutateDB_Create_Call_Permit {
    private _create_call_permit_body: Create_Call_Permit_Body_Field | undefined;

    set_Create_Call_Permit_Body(create_call_permit_body: Create_Call_Permit_Body_Field): void {
        this._create_call_permit_body = create_call_permit_body;
    }

    async run(): Promise<Call_PerMit_Field | undefined> {
        if (this._create_call_permit_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Call_PerMit_Field>(
                    `SELECT * FROM create_call_permit($1, $2, $3, $4, $5);`,
                    [
                        this._create_call_permit_body.uid,
                        this._create_call_permit_body.app_id,
                        this._create_call_permit_body.oa_id,
                        this._create_call_permit_body.call_agent_id,
                        this._create_call_permit_body.account_id,
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

export default MutateDB_Create_Call_Permit;

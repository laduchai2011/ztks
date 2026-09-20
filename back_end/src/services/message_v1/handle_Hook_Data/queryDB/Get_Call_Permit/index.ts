import { pool } from '@src/connect/postgresql';
import { Call_PerMit_Field } from '@src/data_struct/call_agent';
import { Get_Call_Permit_With_Uid_Body_Field } from '@src/data_struct/call_agent/body';

class QueryDB_Get_Call_Permit_With_Uid {
    private _get_call_permit_with_uid_body: Get_Call_Permit_With_Uid_Body_Field | undefined;

    set_Get_Call_Permit_With_Uid_Body(get_call_permit_with_uid_body: Get_Call_Permit_With_Uid_Body_Field): void {
        this._get_call_permit_with_uid_body = get_call_permit_with_uid_body;
    }

    async run(): Promise<Call_PerMit_Field | undefined> {
        if (this._get_call_permit_with_uid_body !== undefined) {
            try {
                const result = await pool.query<Call_PerMit_Field>(`SELECT * FROM get_call_permit_with_uid($1);`, [
                    this._get_call_permit_with_uid_body.uid,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Call_Permit_With_Uid;

import { pool } from '@src/connect/postgresql';
import { Call_Agent_Field } from '@src/data_struct/call_agent';
import { Get_Call_Agent_With_Account_Id_Body_Field } from '@src/data_struct/call_agent/body';

class QueryDB_Get_Call_Agent_With_Account_Id {
    private _get_call_agent_with_account_id_body: Get_Call_Agent_With_Account_Id_Body_Field | undefined;

    set_Get_Call_Agent_With_Account_Id_Body(
        get_call_agent_with_account_id_body: Get_Call_Agent_With_Account_Id_Body_Field
    ): void {
        this._get_call_agent_with_account_id_body = get_call_agent_with_account_id_body;
    }

    async run(): Promise<Call_Agent_Field | undefined> {
        if (this._get_call_agent_with_account_id_body !== undefined) {
            try {
                const result = await pool.query<Call_Agent_Field>(`SELECT * FROM get_call_agent_with_account_id($1);`, [
                    this._get_call_agent_with_account_id_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Call_Agent_With_Account_Id;

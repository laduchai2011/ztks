import { pool } from '@src/connect/postgresql';
import { Agent_Field } from '@src/data_struct/agent';
import { Get_Agent_With_Agent_Account_Id_Body_Field } from '@src/data_struct/agent/body';

class QueryDB_Get_Agent_With_Agent_Account_Id {
    private _get_agent_with_agent_account_id_body: Get_Agent_With_Agent_Account_Id_Body_Field | undefined;

    set_Get_Agent_With_Agent_Account_Id_Body(
        get_agent_with_agent_account_id_body: Get_Agent_With_Agent_Account_Id_Body_Field
    ): void {
        this._get_agent_with_agent_account_id_body = get_agent_with_agent_account_id_body;
    }

    async run(): Promise<Agent_Field | void> {
        if (this._get_agent_with_agent_account_id_body !== undefined) {
            try {
                const result = await pool.query<Agent_Field>(`SELECT * FROM get_agent_with_agent_account_id($1);`, [
                    this._get_agent_with_agent_account_id_body.agent_account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Agent_With_Agent_Account_Id;

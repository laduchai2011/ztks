import { pool } from '@src/connect/postgresql';
import { Agent_Pay_Field } from '@src/data_struct/agent';
import { Get_Last_Agent_Pay_Body_Field } from '@src/data_struct/agent/body';

class QueryDB_Get_Last_Agent_Pay {
    private _get_last_agent_pay_body: Get_Last_Agent_Pay_Body_Field | undefined;

    set_Get_Last_Agent_Pay_Body(get_last_agent_pay_body: Get_Last_Agent_Pay_Body_Field): void {
        this._get_last_agent_pay_body = get_last_agent_pay_body;
    }

    async run(): Promise<Agent_Pay_Field | void> {
        if (this._get_last_agent_pay_body !== undefined) {
            try {
                const result = await pool.query<Agent_Pay_Field>(`SELECT * FROM get_agent_with_id($1);`, [
                    this._get_last_agent_pay_body.agent_id,
                    this._get_last_agent_pay_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Last_Agent_Pay;

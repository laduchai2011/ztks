import { pool } from '@src/connect/postgresql';
import { Agent_Field, Paged_Agent_Field } from '@src/data_struct/agent';
import { Get_Agents_Body_Field } from '@src/data_struct/agent/body';

class QueryDB_Get_Agents {
    private _get_agents_body: Get_Agents_Body_Field | undefined;

    set_Get_Agents_Body(get_agents_body: Get_Agents_Body_Field): void {
        this._get_agents_body = get_agents_body;
    }

    async run(): Promise<Paged_Agent_Field | void> {
        if (this._get_agents_body !== undefined) {
            try {
                const agent_account_id = this._get_agents_body.agent_account_id
                    ? this._get_agents_body.agent_account_id
                    : null;
                const result = await pool.query<{
                    items: Agent_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_agents($1, $2, $3, $4, $5);`, [
                    this._get_agents_body.page,
                    this._get_agents_body.size,
                    this._get_agents_body.offset,
                    this._get_agents_body.account_id,
                    agent_account_id,
                ]);

                const data: Paged_Agent_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Agents;

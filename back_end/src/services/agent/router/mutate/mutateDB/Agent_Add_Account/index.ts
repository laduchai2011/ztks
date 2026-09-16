import { pool } from '@src/connect/postgresql';
import { Agent_Field } from '@src/dataStruct/agent';
import { Agent_Add_Account_Body_Field } from '@src/dataStruct/agent/body';

class MutateDB_Agent_Add_Account {
 
    private _agent_add_account_body: Agent_Add_Account_Body_Field | undefined;

    set_Agent_Add_Account_Body(agent_add_account_body: Agent_Add_Account_Body_Field): void {
        this._agent_add_account_body = agent_add_account_body;
    }

    async run(): Promise<Agent_Field | undefined> {
        if (this._agent_add_account_body !== undefined) {
            const client = await pool.connect();

            try {
                const agent_account_id = this._agent_add_account_body.agent_account_id
                    ? this._agent_add_account_body.agent_account_id
                    : null

                await client.query('BEGIN');
                
                const result = await pool.query<Agent_Field>(`SELECT * FROM agent_add_account($1, $2, $3);`, [
                    this._agent_add_account_body.id,
                    this._agent_add_account_body.account_id,
                    agent_account_id
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

export default MutateDB_Agent_Add_Account;

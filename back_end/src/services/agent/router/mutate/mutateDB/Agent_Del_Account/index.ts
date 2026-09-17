import { pool } from '@src/connect/postgresql';
import { Agent_Field } from '@src/data_struct/agent';
import { Agent_Del_Account_Body_Field } from '@src/data_struct/agent/body';

class MutateDB_Agent_Del_Account {
    private _agent_del_account_body: Agent_Del_Account_Body_Field | undefined;

    set_Agent_Del_Account_Body(agent_del_account_body: Agent_Del_Account_Body_Field): void {
        this._agent_del_account_body = agent_del_account_body;
    }

    async run(): Promise<Agent_Field | undefined> {
        if (this._agent_del_account_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Agent_Field>(`SELECT * FROM agent_del_account($1, $2);`, [
                    this._agent_del_account_body.id,
                    this._agent_del_account_body.account_id,
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

export default MutateDB_Agent_Del_Account;

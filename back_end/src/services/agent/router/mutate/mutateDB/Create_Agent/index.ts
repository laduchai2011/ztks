import { pool } from '@src/connect/postgresql';
import { Agent_Field } from '@src/data_struct/agent';
import { Create_Agent_Body_Field } from '@src/data_struct/agent/body';

class MutateDB_Create_Agent {
    private _create_agent_body: Create_Agent_Body_Field | undefined;

    set_Create_Agent_Body(create_agent_body: Create_Agent_Body_Field): void {
        this._create_agent_body = create_agent_body;
    }

    async run(): Promise<Agent_Field | undefined> {
        if (this._create_agent_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Agent_Field>(`SELECT * FROM create_agent($1);`, [
                    this._create_agent_body.account_id,
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

export default MutateDB_Create_Agent;

import { pool } from '@src/connect/postgresql';
import { Agent_Pay_Field } from '@src/data_struct/agent';
import { Create_Agent_Pay_Body_Field } from '@src/data_struct/agent/body';

class MutateDB_Create_Agent_Pay {
    private _create_agent_pay_body: Create_Agent_Pay_Body_Field | undefined;

    set_Create_Agent_Pay_Body(create_agent_pay_body: Create_Agent_Pay_Body_Field): void {
        this._create_agent_pay_body = create_agent_pay_body;
    }

    async run(): Promise<Agent_Pay_Field | undefined> {
        if (this._create_agent_pay_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Agent_Pay_Field>(`SELECT * FROM create_agent_pay($1, $2);`, [
                    this._create_agent_pay_body.agent_id,
                    this._create_agent_pay_body.account_id,
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

export default MutateDB_Create_Agent_Pay;

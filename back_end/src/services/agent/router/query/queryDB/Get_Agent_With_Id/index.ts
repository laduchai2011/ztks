import { pool } from '@src/connect/postgresql';
import { Agent_Field } from '@src/data_struct/agent';

class QueryDB_Get_Agent_With_Id {
    private _id: string | undefined;

    set_Id(id: string): void {
        this._id = id;
    }

    async run(): Promise<Agent_Field | void> {
        if (this._id !== undefined) {
            try {
                const result = await pool.query<Agent_Field>(`SELECT * FROM get_agent_with_id($1);`, [this._id]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Agent_With_Id;

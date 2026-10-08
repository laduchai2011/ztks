import { pool } from '@src/connect/postgresql';
import { Team_Field } from '@src/data_struct/team';
import { Get_Team_Leader_Body_Field } from '@src/data_struct/team/body';

class QueryDB_Get_Team_Leader {
    private _get_team_leader_body: Get_Team_Leader_Body_Field | undefined;

    set_Get_Team_Leader_Body(get_team_leader_body: Get_Team_Leader_Body_Field): void {
        this._get_team_leader_body = get_team_leader_body;
    }

    async run(): Promise<Team_Field | void> {
        if (this._get_team_leader_body !== undefined) {
            try {
                const result = await pool.query<Team_Field>('SELECT * FROM get_team_leader($1::UUID)', [
                    this._get_team_leader_body.team_id,
                ]);

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Team_Leader;

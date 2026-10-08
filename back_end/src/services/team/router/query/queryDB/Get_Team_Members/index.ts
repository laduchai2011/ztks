import { pool } from '@src/connect/postgresql';
import { Cursor_Team_Member_Field } from '@src/data_struct/team';
import { Get_Team_Members_Body_Field } from '@src/data_struct/team/body';

class QueryDB_Get_Team_Members {
    private _get_team_members_body: Get_Team_Members_Body_Field | undefined;

    set_Get_Team_Members_Body(get_team_members_body: Get_Team_Members_Body_Field): void {
        this._get_team_members_body = get_team_members_body;
    }

    async run(): Promise<Cursor_Team_Member_Field | void> {
        if (this._get_team_members_body !== undefined) {
            const cursor = this._get_team_members_body.cursor ? this._get_team_members_body.cursor : null;

            try {
                const result = await pool.query<{ get_team_members: Cursor_Team_Member_Field }>(
                    'SELECT * FROM get_team_members($1::UUID, $2::UUID, $3)',
                    [this._get_team_members_body.team_id, this._get_team_members_body.limit, cursor]
                );

                if (result.rows.length > 0) {
                    return result.rows[0].get_team_members;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Team_Members;

import { pool } from '@src/connect/postgresql';
import { Cursor_Team_Field } from '@src/data_struct/team';
import { Get_Teams_Body_Field } from '@src/data_struct/team/body';

class QueryDB_Get_Teams {
    private _get_teams_body: Get_Teams_Body_Field | undefined;

    set_Get_Teams_Body(get_teams_body: Get_Teams_Body_Field): void {
        this._get_teams_body = get_teams_body;
    }

    async run(): Promise<Cursor_Team_Field | void> {
        if (this._get_teams_body !== undefined) {
            const cursor = this._get_teams_body.cursor ? this._get_teams_body.cursor : null;

            try {
                const result = await pool.query<Cursor_Team_Field>('SELECT * FROM get_teams($1::UUID, $2, $3::UUID)', [
                    this._get_teams_body.admin_account_id,
                    this._get_teams_body.limit,
                    cursor,
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

export default QueryDB_Get_Teams;

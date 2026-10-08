import { pool } from '@src/connect/postgresql';
import { Team_Field } from '@src/data_struct/team';
import { Edit_Team_Body_Field } from '@src/data_struct/team/body';

class MutateDB_Edit_Team {
    private _edit_team_body: Edit_Team_Body_Field | undefined;

    set_Edit_Team_Body(edit_team_body: Edit_Team_Body_Field): void {
        this._edit_team_body = edit_team_body;
    }

    async run(): Promise<Team_Field | undefined> {
        if (this._edit_team_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Field>('SELECT * FROM edit_team($1::UUID, $2, $3::UUID)', [
                    this._edit_team_body.id,
                    this._edit_team_body.name,
                    this._edit_team_body.admin_account_id,
                ]);

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error('PostgreSQL error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Team;

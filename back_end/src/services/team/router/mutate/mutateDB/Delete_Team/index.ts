import { pool } from '@src/connect/postgresql';
import { Team_Field } from '@src/data_struct/team';
import { Delete_Team_Body_Field } from '@src/data_struct/team/body';

class MutateDB_Delete_Team {
    private _delete_team_body: Delete_Team_Body_Field | undefined;

    set_Delete_Team_Body(delete_team_body: Delete_Team_Body_Field): void {
        this._delete_team_body = delete_team_body;
    }

    async run(): Promise<Team_Field | undefined> {
        if (this._delete_team_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Field>('SELECT * FROM delete_team($1, $2::UUID)', [
                    this._delete_team_body.id,
                    this._delete_team_body.admin_account_id,
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

export default MutateDB_Delete_Team;

import { pool } from '@src/connect/postgresql';
import { Team_Field } from '@src/data_struct/team';
import { Lock_Team_Body_Field } from '@src/data_struct/team/body';

class MutateDB_Lock_Team {
    private _lock_team_body: Lock_Team_Body_Field | undefined;

    set_Lock_Team_Body(lock_team_body: Lock_Team_Body_Field): void {
        this._lock_team_body = lock_team_body;
    }

    async run(): Promise<Team_Field | undefined> {
        if (this._lock_team_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Field>('SELECT * FROM lock_team($1::UUID, $2, $3::UUID)', [
                    this._lock_team_body.id,
                    this._lock_team_body.is_lock,
                    this._lock_team_body.admin_account_id,
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

export default MutateDB_Lock_Team;

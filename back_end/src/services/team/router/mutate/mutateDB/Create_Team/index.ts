import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Team_Field } from '@src/data_struct/team';
import { Create_Team_Body_Field } from '@src/data_struct/team/body';

class MutateDB_Create_Team {
    private _create_team_body: Create_Team_Body_Field | undefined;

    set_Create_Team_Body(create_team_body: Create_Team_Body_Field): void {
        this._create_team_body = create_team_body;
    }

    async run(): Promise<Team_Field | undefined> {
        if (this._create_team_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Field>('SELECT * FROM create_team($1, $2, $3::UUID)', [
                    this._create_team_body.name,
                    this._create_team_body.type,
                    this._create_team_body.admin_account_id,
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

export default MutateDB_Create_Team;

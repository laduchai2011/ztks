import { pool } from '@src/connect/postgresql';
import { Team_Member_Field } from '@src/data_struct/team';
import { Add_Team_Member_Body_Field } from '@src/data_struct/team/body';

class MutateDB_Add_Team_Member {
    private _add_team_member_body: Add_Team_Member_Body_Field | undefined;

    set_Add_Team_Member_Body(add_team_member_body: Add_Team_Member_Body_Field): void {
        this._add_team_member_body = add_team_member_body;
    }

    async run(): Promise<Team_Member_Field | undefined> {
        if (this._add_team_member_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Team_Member_Field>(
                    'SELECT * FROM add_team_member($1::UUID, $2::UUID, $3::UUID, $4)',
                    [
                        this._add_team_member_body.team_id,
                        this._add_team_member_body.account_id,
                        this._add_team_member_body.admin_account_id,
                        this._add_team_member_body.role,
                    ]
                );

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

export default MutateDB_Add_Team_Member;

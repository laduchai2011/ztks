import { pool } from '@src/connect/postgresql';
import { Leave_Admin_Body_Field } from '@src/data_struct/account/body';

class MutateDB_Leave_Admin {
    private _leave_admin_body: Leave_Admin_Body_Field | undefined;

    set_Leave_Admin_Body(leave_admin_body: Leave_Admin_Body_Field): void {
        this._leave_admin_body = leave_admin_body;
    }

    async run(): Promise<boolean | undefined> {
        if (this._leave_admin_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<{ is_success: boolean }>(`SELECT * FROM leave_admin($1);`, [
                    this._leave_admin_body.account_id,
                ]);

                await client.query('COMMIT');

                return result.rows[0].is_success;
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Leave_Admin;

import { pool } from '@src/connect/postgresql';
import { Account_Information_Field } from '@src/dataStruct/account';
import { Add_Member_V1_Body_Field } from '@src/dataStruct/account/body';

class MutateDB_Add_Member_V1 {
    private _add_member_v1_body: Add_Member_V1_Body_Field | undefined;

    set_Add_Member_V1_Body_Field(add_member_v1_body: Add_Member_V1_Body_Field): void {
        this._add_member_v1_body = add_member_v1_body;
    }

    async run(): Promise<Account_Information_Field | undefined> {
        if (this._add_member_v1_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Account_Information_Field>(`SELECT * FROM add_member_v1($1, $2);`, [
                    this._add_member_v1_body.added_by_id,
                    this._add_member_v1_body.account_id,
                ]);

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Add_Member_V1;

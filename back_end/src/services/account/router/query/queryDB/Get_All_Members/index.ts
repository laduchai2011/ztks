import { pool } from '@src/connect/postgresql';
import { Account_Field, All_Members_Body_Field } from '@src/data_struct/account';

class QueryDB_Get_All_Members {
    private _all_members_body: All_Members_Body_Field | undefined;

    set_All_Members_Body(all_members_body: All_Members_Body_Field): void {
        this._all_members_body = all_members_body;
    }

    async run(): Promise<Account_Field[] | void> {
        if (this._all_members_body !== undefined) {
            try {
                const result = await pool.query<Account_Field>('SELECT * FROM get_all_members($1::UUID)', [
                    this._all_members_body.added_by_id,
                ]);

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_All_Members;

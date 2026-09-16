import { pool } from '@src/connect/postgresql';
import { Account_Field, Paged_Account_Field } from '@src/dataStruct/account';
import { Get_Members_Body_Field } from '@src/dataStruct/account/body';

class QueryDB_Get_Members {

    private _get_members_body: Get_Members_Body_Field | undefined;

    set_Get_Members_Body(get_members_body: Get_Members_Body_Field): void {
        this._get_members_body = get_members_body;
    }

    async run(): Promise<Paged_Account_Field | void> {
        if (this._get_members_body !== undefined) {
            try {
                const searched_account_id = this._get_members_body.searched_account_id
                    ? this._get_members_body.searched_account_id
                    : null
                const result = await pool.query<{
                    items: Account_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_members($1, $2, $3, $4);`, [
                    this._get_members_body.page,
                    this._get_members_body.size,
                    this._get_members_body.account_id,
                    searched_account_id
                ]);

                const data: Paged_Account_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count)
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Members;

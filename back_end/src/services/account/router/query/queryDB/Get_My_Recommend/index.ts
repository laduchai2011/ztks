import { pool } from '@src/connect/postgresql';
import { Recommend_Field } from '@src/data_struct/account';
import { Get_My_Recommend_Body_Field } from '@src/data_struct/account/body';

class QueryDB_Get_My_Recommend {
    private _get_my_recommend_body: Get_My_Recommend_Body_Field | undefined;

    set_Get_My_Recommend_Body(get_my_recommend_body: Get_My_Recommend_Body_Field): void {
        this._get_my_recommend_body = get_my_recommend_body;
    }

    async run(): Promise<Recommend_Field | void> {
        if (this._get_my_recommend_body !== undefined) {
            try {
                const result = await pool.query<Recommend_Field>(`SELECT * FROM get_my_recommend($1);`, [
                    this._get_my_recommend_body.account_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_My_Recommend;

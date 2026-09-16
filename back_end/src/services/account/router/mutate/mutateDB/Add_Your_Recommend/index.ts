import { pool } from '@src/connect/postgresql';
import { Recommend_Field } from '@src/dataStruct/account';
import { Add_Your_Recommend_Body_Field } from '@src/dataStruct/account/body';

class MutateDB_Add_Your_Recommend {
    private _add_your_recommend_body: Add_Your_Recommend_Body_Field | undefined;


    setA_Add_Your_Recommend_Body(add_your_recommend_body: Add_Your_Recommend_Body_Field): void {
        this._add_your_recommend_body = add_your_recommend_body;
    }

    async run(): Promise<Recommend_Field | undefined> {
        if (this._add_your_recommend_body !== undefined) {
            const client = await pool.connect();

            try {
             
                await client.query('BEGIN');
                
                const result = await pool.query<Recommend_Field>(`SELECT * FROM add_your_recommend($1, $2);`, [
                    this._add_your_recommend_body.your_code,
                    this._add_your_recommend_body.account_id,
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

export default MutateDB_Add_Your_Recommend;

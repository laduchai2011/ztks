import { pool } from '@src/connect/postgresql';
import { Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Get_Require_With_Id_Body_Field } from '@src/data_struct/wallet/body';

class QueryDB_Get_Require_With_Id {
    private _get_require_with_id_body: Get_Require_With_Id_Body_Field | undefined;

    set_Get_Require_With_Id_Body(get_require_with_id_body: Get_Require_With_Id_Body_Field): void {
        this._get_require_with_id_body = get_require_with_id_body;
    }

    async run(): Promise<Require_Take_Money_Field | void> {
        if (this._get_require_with_id_body !== undefined) {
            try {
                const result = await pool.query<Require_Take_Money_Field>(`SELECT * FROM get_require_with_id($1);`, [
                    this._get_require_with_id_body.id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Require_With_Id;

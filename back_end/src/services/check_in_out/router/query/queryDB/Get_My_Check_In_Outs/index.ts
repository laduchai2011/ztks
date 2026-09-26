import { pool } from '@src/connect/postgresql';
import { Check_In_Out_With_Date_Field } from '@src/data_struct/check_in_out';
import { Get_My_Check_In_Outs_Body_Field } from '@src/data_struct/check_in_out/body';

class QueryDB_Get_My_Check_In_Outs {
    private _get_my_check_in_outs_body: Get_My_Check_In_Outs_Body_Field | undefined;

    set_Get_My_Check_In_Outs_Body(get_my_check_in_outs_body: Get_My_Check_In_Outs_Body_Field): void {
        this._get_my_check_in_outs_body = get_my_check_in_outs_body;
    }

    async run(): Promise<Check_In_Out_With_Date_Field[] | void> {
        if (this._get_my_check_in_outs_body !== undefined) {
            try {
                const result = await pool.query<Check_In_Out_With_Date_Field>(
                    'SELECT * FROM get_my_check_in_outs($1, $2, $3::UUID)',
                    [
                        this._get_my_check_in_outs_body.from_date,
                        this._get_my_check_in_outs_body.to_date,
                        this._get_my_check_in_outs_body.account_id,
                    ]
                );

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_My_Check_In_Outs;

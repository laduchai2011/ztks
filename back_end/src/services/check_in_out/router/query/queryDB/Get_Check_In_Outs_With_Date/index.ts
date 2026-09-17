import { pool } from '@src/connect/postgresql';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';
import { Get_Check_In_Outs_With_Date_Body_Field } from '@src/data_struct/check_in_out/body';

class QueryDB_Get_Check_In_Outs_With_Date {
    private _get_check_in_outs_with_date_body: Get_Check_In_Outs_With_Date_Body_Field | undefined;

    set_Get_Check_In_Outs_With_Date_Body(
        get_check_in_outs_with_date_body: Get_Check_In_Outs_With_Date_Body_Field
    ): void {
        this._get_check_in_outs_with_date_body = get_check_in_outs_with_date_body;
    }

    async run(): Promise<Check_In_Out_Field[] | void> {
        if (this._get_check_in_outs_with_date_body !== undefined) {
            try {
                const result = await pool.query<Check_In_Out_Field>(
                    `SELECT * FROM get_check_in_outs_with_date($1, $2, $3);`,
                    [
                        this._get_check_in_outs_with_date_body.type,
                        this._get_check_in_outs_with_date_body.date,
                        this._get_check_in_outs_with_date_body.account_id,
                    ]
                );

                return result.rows;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Check_In_Outs_With_Date;

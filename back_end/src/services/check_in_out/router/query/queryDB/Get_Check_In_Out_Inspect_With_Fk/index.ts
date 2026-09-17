import { pool } from '@src/connect/postgresql';
import { Check_In_Out_Inspect_Field } from '@src/data_struct/check_in_out';
import { Get_Check_In_Out_Inspect_With_Fk_Body_Field } from '@src/data_struct/check_in_out/body';

class QueryDB_Get_Check_In_Out_Inspect_With_Id {
    private _get_check_in_out_inspect_with_fk_body: Get_Check_In_Out_Inspect_With_Fk_Body_Field | undefined;

    set_Get_Check_In_Out_Inspect_With_Fk_Body(
        get_check_in_out_inspect_with_fk_body: Get_Check_In_Out_Inspect_With_Fk_Body_Field
    ): void {
        this._get_check_in_out_inspect_with_fk_body = get_check_in_out_inspect_with_fk_body;
    }

    async run(): Promise<Check_In_Out_Inspect_Field | void> {
        if (this._get_check_in_out_inspect_with_fk_body !== undefined) {
            try {
                const result = await pool.query<Check_In_Out_Inspect_Field>(
                    `SELECT * FROM get_check_in_out_inspect_with_fk($1);`,
                    [this._get_check_in_out_inspect_with_fk_body.check_in_out_id]
                );

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Check_In_Out_Inspect_With_Id;

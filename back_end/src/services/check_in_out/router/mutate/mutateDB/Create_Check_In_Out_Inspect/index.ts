import { pool } from '@src/connect/postgresql';
import { Check_In_Out_Inspect_Field } from '@src/data_struct/check_in_out';
import { Create_Check_In_Out_Inspect_Body_Field } from '@src/data_struct/check_in_out/body';

class MutateDB_Create_Check_In_Out_Inspect {
    private _create_check_in_out_inspect_body: Create_Check_In_Out_Inspect_Body_Field | undefined;

    set_Create_Check_In_Out_Inspect_Body(
        create_check_in_out_inspect_body: Create_Check_In_Out_Inspect_Body_Field
    ): void {
        this._create_check_in_out_inspect_body = create_check_in_out_inspect_body;
    }

    async run(): Promise<Check_In_Out_Inspect_Field | undefined> {
        if (this._create_check_in_out_inspect_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Check_In_Out_Inspect_Field>(
                    `SELECT * FROM create_check_in_out_inspect($1, $2, $3, $4);`,
                    [
                        this._create_check_in_out_inspect_body.content,
                        this._create_check_in_out_inspect_body.is_pass,
                        this._create_check_in_out_inspect_body.check_in_out_id,
                        this._create_check_in_out_inspect_body.account_id,
                    ]
                );

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

export default MutateDB_Create_Check_In_Out_Inspect;

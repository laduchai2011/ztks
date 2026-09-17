import { pool } from '@src/connect/postgresql';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';
import { Create_Check_In_Out_Body_Field } from '@src/data_struct/check_in_out/body';

class MutateDB_Create_Check_In_Out {
    private _create_check_in_out_body: Create_Check_In_Out_Body_Field | undefined;

    set_Create_Check_In_Out_Body(create_check_in_out_body: Create_Check_In_Out_Body_Field): void {
        this._create_check_in_out_body = create_check_in_out_body;
    }

    async run(): Promise<Check_In_Out_Field | undefined> {
        if (this._create_check_in_out_body !== undefined) {
            const client = await pool.connect();

            const image = this._create_check_in_out_body.image ? this._create_check_in_out_body.image : null;
            const video = this._create_check_in_out_body.video ? this._create_check_in_out_body.video : null;

            try {
                await client.query('BEGIN');

                const result = await pool.query<Check_In_Out_Field>(
                    `SELECT * FROM create_check_in_out($1, $2, $3, $4, $5);`,
                    [
                        this._create_check_in_out_body.type,
                        this._create_check_in_out_body.note,
                        this._create_check_in_out_body.account_id,
                        image,
                        video,
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

export default MutateDB_Create_Check_In_Out;

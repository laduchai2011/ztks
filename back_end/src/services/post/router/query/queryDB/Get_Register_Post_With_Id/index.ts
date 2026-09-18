import { pool } from '@src/connect/postgresql';
import { Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Post_With_Id_Body_Field } from '@src/data_struct/post/body';

class QueryDB_Get_Register_Post_With_Id {
    private _get_register_post_with_id_body: Get_Register_Post_With_Id_Body_Field | undefined;

    set_Get_Register_Post_With_Id_Body(get_register_post_with_id_body: Get_Register_Post_With_Id_Body_Field): void {
        this._get_register_post_with_id_body = get_register_post_with_id_body;
    }

    async run(): Promise<Register_Post_Field | void> {
        if (this._get_register_post_with_id_body !== undefined) {
            try {
                const result = await pool.query<Register_Post_Field>(`SELECT * FROM get_register_post_with_id($1);`, [
                    this._get_register_post_with_id_body.id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Register_Post_With_Id;

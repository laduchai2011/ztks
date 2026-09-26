import { pool } from '@src/connect/postgresql';
import { Post_Field } from '@src/data_struct/post';
import { Get_Post_With_Id_Body_Field } from '@src/data_struct/post/body';

class QueryDB_Get_Post_With_Id {
    private _get_post_with_id_body: Get_Post_With_Id_Body_Field | undefined;

    set_Get_Post_With_Id_Body(get_post_with_id_body: Get_Post_With_Id_Body_Field): void {
        this._get_post_with_id_body = get_post_with_id_body;
    }

    async run(): Promise<Post_Field | void> {
        if (this._get_post_with_id_body !== undefined) {
            try {
                const result = await pool.query<Post_Field>('SELECT * FROM get_post_with_id($1::UUID)', [
                    this._get_post_with_id_body.id,
                ]);

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Post_With_Id;

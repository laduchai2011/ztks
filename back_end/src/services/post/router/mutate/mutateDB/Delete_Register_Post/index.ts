import { pool } from '@src/connect/postgresql';
import { Register_Post_Field } from '@src/data_struct/post';
import { Delete_Register_Post_Body_Field } from '@src/data_struct/post/body';

class MutateDB_Delete_Register_Post {
    private _delete_register_post_body: Delete_Register_Post_Body_Field | undefined;

    set_Delete_Register_Post_Body(delete_register_post_body: Delete_Register_Post_Body_Field): void {
        this._delete_register_post_body = delete_register_post_body;
    }

    async run(): Promise<Register_Post_Field | undefined> {
        if (this._delete_register_post_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Register_Post_Field>(`SELECT * FROM delete_register_post($1, $2);`, [
                    this._delete_register_post_body.id,
                    this._delete_register_post_body.account_id,
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

export default MutateDB_Delete_Register_Post;

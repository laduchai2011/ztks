import { pool } from '@src/connect/postgresql';
import { Register_Post_Field } from '@src/data_struct/post';
import { Edit_Register_Post_Body_Field } from '@src/data_struct/post/body';

class MutateDB_Edit_Register_Post {
    private _edit_register_post_body: Edit_Register_Post_Body_Field | undefined;

    set_Edit_Register_Post_Body(edit_register_post_body: Edit_Register_Post_Body_Field): void {
        this._edit_register_post_body = edit_register_post_body;
    }

    async run(): Promise<Register_Post_Field | undefined> {
        if (this._edit_register_post_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Register_Post_Field>(
                    'SELECT * FROM edit_register_post($1::UUID, $2, $3::UUID, $4::UUID)',
                    [
                        this._edit_register_post_body.id,
                        this._edit_register_post_body.name,
                        this._edit_register_post_body.zalo_oa_id,
                        this._edit_register_post_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Register_Post;

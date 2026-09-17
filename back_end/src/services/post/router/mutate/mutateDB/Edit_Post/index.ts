import { pool } from '@src/connect/postgresql';
import { Post_Field } from '@src/data_struct/post';
import { Edit_Post_Body_Field } from '@src/data_struct/post/body';

class MutateDB_Edit_Post {
    private _edit_post_body: Edit_Post_Body_Field | undefined;

    set_Edit_Post_Body(edit_post_body: Edit_Post_Body_Field): void {
        this._edit_post_body = edit_post_body;
    }

    async run(): Promise<Post_Field | undefined> {
        if (this._edit_post_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Post_Field>(
                    `SELECT * FROM edit_post($1, $2, $3, $4, $5, $6, $7, $8);`,
                    [
                        this._edit_post_body.id,
                        this._edit_post_body.index,
                        this._edit_post_body.name,
                        this._edit_post_body.title,
                        this._edit_post_body.describe,
                        this._edit_post_body.images,
                        this._edit_post_body.is_active,
                        this._edit_post_body.account_id,
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

export default MutateDB_Edit_Post;

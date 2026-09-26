import { pool } from '@src/connect/postgresql';
import { Post_Field } from '@src/data_struct/post';
import { Create_Post_Body_Field } from '@src/data_struct/post/body';

class MutateDB_Create_Post {
    private _create_post_body: Create_Post_Body_Field | undefined;

    set_Create_Post_Body(create_post_body: Create_Post_Body_Field): void {
        this._create_post_body = create_post_body;
    }

    async run(): Promise<Post_Field | undefined> {
        if (this._create_post_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Post_Field>(
                    'SELECT * FROM create_post($1, $2, $3, $4, $5, $6, $7, $8, $9::UUID)',
                    [
                        this._create_post_body.index,
                        this._create_post_body.name,
                        this._create_post_body.type,
                        this._create_post_body.title,
                        this._create_post_body.describe,
                        this._create_post_body.images,
                        this._create_post_body.is_active,
                        this._create_post_body.register_post_id,
                        this._create_post_body.account_id,
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

export default MutateDB_Create_Post;

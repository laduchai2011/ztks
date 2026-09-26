import { pool } from '@src/connect/postgresql';
import { Register_Post_Field } from '@src/data_struct/post';
import { Create_Register_Post_Body_Field } from '@src/data_struct/post/body';

class MutateDB_Create_Register_Post {
    private _create_register_post_body: Create_Register_Post_Body_Field | undefined;

    set_Create_Register_Post_Body(create_register_post_body: Create_Register_Post_Body_Field): void {
        this._create_register_post_body = create_register_post_body;
    }

    async run(): Promise<Register_Post_Field | undefined> {
        if (this._create_register_post_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Register_Post_Field>(
                    'SELECT * FROM create_register_post($1, $2, $3::UUID, $4::UUID)',
                    [
                        this._create_register_post_body.name,
                        this._create_register_post_body.type,
                        this._create_register_post_body.zalo_oa_id,
                        this._create_register_post_body.account_id,
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

export default MutateDB_Create_Register_Post;

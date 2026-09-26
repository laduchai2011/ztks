import { pool } from '@src/connect/postgresql';
import { Post_Field, Paged_Post_Field } from '@src/data_struct/post';
import { Get_Posts_Body_Field } from '@src/data_struct/post/body';

class QueryDB_Get_Posts {
    private _get_posts_body: Get_Posts_Body_Field | undefined;

    set_Get_Posts_Body(get_posts_body: Get_Posts_Body_Field): void {
        this._get_posts_body = get_posts_body;
    }

    async run(): Promise<Paged_Post_Field | void> {
        if (this._get_posts_body !== undefined) {
            const is_active = this._get_posts_body.is_active !== undefined ? this._get_posts_body.is_active : null;

            try {
                const result = await pool.query<{
                    items: Post_Field[];
                    total_count: string;
                }>('SELECT * FROM get_posts($1, $2, $3::UUID, $4)', [
                    this._get_posts_body.page,
                    this._get_posts_body.size,
                    this._get_posts_body.register_post_id,
                    is_active,
                ]);

                if (result.rows.length > 0) {
                    const data: Paged_Post_Field = {
                        items: result.rows[0].items,
                        total_count: Number(result.rows[0].total_count),
                    };

                    return data;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Posts;

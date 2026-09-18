import { pool } from '@src/connect/postgresql';
import { Register_Post_Field, Paged_Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Posts_Body_Field } from '@src/data_struct/post/body';

class QueryDB_Get_Register_Posts {
    private _get_register_posts_body: Get_Register_Posts_Body_Field | undefined;

    set_Get_Register_Posts_Body(get_register_posts_body: Get_Register_Posts_Body_Field): void {
        this._get_register_posts_body = get_register_posts_body;
    }

    async run(): Promise<Paged_Register_Post_Field | void> {
        if (this._get_register_posts_body !== undefined) {
            const is_delete =
                this._get_register_posts_body.is_delete !== undefined ? this._get_register_posts_body.is_delete : null;

            try {
                const result = await pool.query<{
                    items: Register_Post_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_register_posts($1, $2, $3, $4);`, [
                    this._get_register_posts_body.page,
                    this._get_register_posts_body.size,
                    this._get_register_posts_body.account_id,
                    is_delete,
                ]);

                const data: Paged_Register_Post_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Register_Posts;

import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Post_Field } from '@src/data_struct/post';
import { Get_Posts_Body_Field } from '@src/data_struct/post/body';
import QueryDB_Get_Posts from '../../queryDB/Get_Posts';
import { Cache_Get_Posts } from '@src/const/redisKey/post';

class Handle_Get_Posts {
    private _cache_get_posts = new Cache_Get_Posts();

    constructor() {
        this._cache_get_posts.init();
    }

    main = async (req: Request<any, any, Get_Posts_Body_Field>, res: Response) => {
        const get_posts_body = req.body;
        this._cache_get_posts.set_Body(get_posts_body);
        this._cache_get_posts.set_Fk(get_posts_body.register_post_id);

        const my_response: My_Response_Field<Paged_Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Posts-main)',
        };

        const paged_cache = await this._cache_get_posts.get_Data();
        if (paged_cache) {
            my_response.data = paged_cache;
            my_response.message = 'Lấy những bài đăng thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Posts();
        queryDB.set_Get_Posts_Body(get_posts_body);

        try {
            const result = await queryDB.run();
            if (result) {
                this._cache_get_posts.set_Data(result);

                my_response.data = result;
                my_response.message = 'Lấy những bài đăng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những bài đăng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những bài đăng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Posts;

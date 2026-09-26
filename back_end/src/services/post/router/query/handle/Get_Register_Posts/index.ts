import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Paged_Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Posts_Body_Field } from '@src/data_struct/post/body';
import QueryDB_Get_Register_Posts from '../../queryDB/Get_Register_Posts';
import { Cache_Get_Register_Posts } from '@src/const/redisKey/post';

class Handle_Get_Register_Posts {
    private _cache_get_register_posts = new Cache_Get_Register_Posts();

    constructor() {
        this._cache_get_register_posts.init();
    }

    main = async (req: Request<any, any, Get_Register_Posts_Body_Field>, res: Response) => {
        const get_register_posts_body = req.body;
        this._cache_get_register_posts.set_Body(get_register_posts_body);
        this._cache_get_register_posts.set_Fk(get_register_posts_body.account_id);

        const my_response: My_Response_Field<Paged_Register_Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Register_Posts-main)',
        };

        const paged_cache = await this._cache_get_register_posts.get_Data();
        if (paged_cache) {
            my_response.data = paged_cache;
            my_response.message = 'Lấy những đăng ký bài đăng thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Register_Posts();
        queryDB.set_Get_Register_Posts_Body(get_register_posts_body);

        try {
            const result = await queryDB.run();
            if (result) {
                this._cache_get_register_posts.set_Data(result);

                my_response.data = result;
                my_response.message = 'Lấy những đăng ký bài đăng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những đăng ký bài đăng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những đăng ký bài đăng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Register_Posts;

import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Register_Post_Field } from '@src/data_struct/post';
import { Create_Register_Post_Body_Field } from '@src/data_struct/post/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Register_Post from '../../mutateDB/Create_Register_Post';
import { Cache_Get_Register_Posts } from '@src/const/redisKey/post';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Register_Post {
    private _cache_get_register_posts = new Cache_Get_Register_Posts();

    constructor() {
        this._cache_get_register_posts.init();
    }

    setup = async (req: Request<any, any, Create_Register_Post_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Register_Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Register_Post-setup)',
        };

        const create_register_post_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_Refresh_Token(refreshToken);

            if (verify_refreshToken === 'invalid') {
                my_response.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            if (verify_refreshToken === 'expired') {
                my_response.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(my_response);
                return;
            }

            const { id } = verify_refreshToken;
            create_register_post_body.account_id = id;
            res.locals.create_register_post_body = create_register_post_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_register_post_body = res.locals.create_register_post_body as Create_Register_Post_Body_Field;

        const my_response: My_Response_Field<Register_Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Register_Post-main)',
        };

        const mutateDB = new MutateDB_Create_Register_Post();
        mutateDB.set_Create_Register_Post_Body(create_register_post_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const data = result;

                this._cache_get_register_posts.set_Fk(data.account_id);
                this._cache_get_register_posts.clear_Cache();

                my_response.message = 'Tạo đăng ký bài viết thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo đăng ký bài viết KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo đăng ký bài viết KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Register_Post;

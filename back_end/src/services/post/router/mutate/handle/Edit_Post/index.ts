import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Post_Field } from '@src/data_struct/post';
import { Edit_Post_Body_Field } from '@src/data_struct/post/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Edit_Post from '../../mutateDB/Edit_Post';
import { Cache_Get_Post_With_Id, Cache_Get_Posts } from '@src/const/redisKey/post';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Edit_Post {
    private _cache_get_post_with_id = new Cache_Get_Post_With_Id();
    private _cache_get_posts = new Cache_Get_Posts();

    constructor() {
        this._cache_get_post_with_id.init();
        this._cache_get_posts.init();
    }

    setup = async (req: Request<any, any, Edit_Post_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Post-setup)',
        };

        const edit_post_body = req.body;
        const refreshToken = getRefreshToken(req);

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verify_refresh_token(refreshToken);

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
            edit_post_body.account_id = id;
            res.locals.edit_post_body = edit_post_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const edit_post_body = res.locals.edit_post_body as Edit_Post_Body_Field;

        this._cache_get_post_with_id.set_Body({ id: edit_post_body.id });

        const my_response: My_Response_Field<Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Edit_Post-main)',
        };

        const mutateDB = new MutateDB_Edit_Post();
        mutateDB.set_Edit_Post_Body(edit_post_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const data = result;

                this._cache_get_post_with_id.clear_Cache();
                this._cache_get_posts.set_Fk(data.register_post_id);
                this._cache_get_posts.clear_Cache();

                my_response.message = 'Tạo bài viết thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo bài viết KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo bài viết KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Edit_Post;

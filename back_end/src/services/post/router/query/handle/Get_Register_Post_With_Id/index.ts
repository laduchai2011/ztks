import { Request, Response } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Post_With_Id_Body_Field } from '@src/data_struct/post/body';
import QueryDB_Get_Register_Post_With_Id from '../../queryDB/Get_Register_Post_With_Id';
import { Cache_Get_Register_Post_With_Id } from '@src/const/redisKey/post';

class Handle_Get_Register_Post_With_Id {
    private _cache_get_register_post_with_id = new Cache_Get_Register_Post_With_Id();

    constructor() {
        this._cache_get_register_post_with_id.init();
    }

    main = async (req: Request<any, any, Get_Register_Post_With_Id_Body_Field>, res: Response) => {
        const get_register_post_with_id_body = req.body;
        this._cache_get_register_post_with_id.set_Body(get_register_post_with_id_body);

        const my_response: My_Response_Field<Register_Post_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Register_Post_With_Id-main) !',
        };

        const register_post_cache = await this._cache_get_register_post_with_id.get_Data();
        if (register_post_cache) {
            my_response.data = register_post_cache;
            my_response.message = 'Lấy đăng ký bài đăng thành công !';
            my_response.is_success = true;
            res.status(200).json(my_response);
            return;
        }

        const queryDB = new QueryDB_Get_Register_Post_With_Id();
        queryDB.set_Get_Register_Post_With_Id_Body(get_register_post_with_id_body);

        try {
            const result = await queryDB.run();
            if (result) {
                this._cache_get_register_post_with_id.set_Data(result);

                my_response.data = result;
                my_response.message = 'Lấy đăng ký bài đăng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy đăng ký bài đăng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy đăng ký bài đăng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Register_Post_With_Id;

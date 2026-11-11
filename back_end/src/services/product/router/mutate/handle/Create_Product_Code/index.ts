import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Product_Code_Field } from '@src/data_struct/product';
import { Create_Product_Body_Field, Create_Product_Code_Body_Field } from '@src/data_struct/product/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Product_Code from '../../mutateDB/Create_Product_Code';
import { Cache_Get_Posts } from '@src/const/redisKey/post';
import { getRefreshToken } from '@src/device/getDevice';
import { Create_Post_Body_Field } from '@src/data_struct/post/body';

class Handle_Create_Product_Code {
    private _cache_get_posts = new Cache_Get_Posts();

    constructor() {
        this._cache_get_posts.init();
    }

    setup = async (req: Request<any, any, Create_Product_Code_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Product_Code_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Product_Code-setup)',
        };

        const create_product_code_body = req.body;
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
            create_product_code_body.account_id = id;
            res.locals.create_product_code_body = create_product_code_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_product_code_body = res.locals.create_product_code_body as Create_Product_Code_Body_Field;

        const my_response: My_Response_Field<Product_Code_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Product_Code-main)',
        };

        const mutateDB = new MutateDB_Create_Product_Code();
        mutateDB.set_Create_Product_Code_Body(create_product_code_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const data = result;

                my_response.message = 'Tạo mã sản phẩm thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo mã sản phẩm KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo mã sản phẩm KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Product_Code;

import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Shop_Field } from '@src/data_struct/shop';
import { Create_Shop_Body_Field } from '@src/data_struct/shop/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Shop from '../../mutateDB/Create_Shop';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Shop {
    setup = async (req: Request<any, any, Create_Shop_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Shop_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Shop-setup)',
        };

        const create_shop_body = req.body;
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
            create_shop_body.account_id = id;

            res.locals.create_shop_body = create_shop_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_shop_body = res.locals.create_shop_body as Create_Shop_Body_Field;

        const my_response: My_Response_Field<Shop_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Shop-main)',
        };

        const mutateDB = new MutateDB_Create_Shop();
        mutateDB.set_Create_Shop_Body(create_shop_body);

        try {
            const result = await mutateDB.run();
        } catch (error) {
            my_response.message = 'Tạo cửa hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Shop;

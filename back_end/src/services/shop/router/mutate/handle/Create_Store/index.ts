import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Store_Field } from '@src/data_struct/shop';
import { Create_Store_Body_Field } from '@src/data_struct/shop/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Store from '../../mutateDB/Create_Store';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Store {
    setup = async (req: Request<any, any, Create_Store_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Store_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Store-setup)',
        };

        const create_store_body = req.body;
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
            create_store_body.account_id = id;

            res.locals.create_store_body = create_store_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_store_body = res.locals.create_store_body as Create_Store_Body_Field;

        const my_response: My_Response_Field<Store_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Store-main)',
        };

        const mutateDB = new MutateDB_Create_Store();
        mutateDB.set_Create_Store_Body(create_store_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo gian hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo gian hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo cửa hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Store;

import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Create_Zalo_Oa_Body_Field } from '@src/data_struct/zalo/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Zalo_Oa from '../../mutateDB/Create_Zalo_Oa';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Zalo_Oa {
    setup = async (req: Request<any, any, Create_Zalo_Oa_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Zalo_Oa-setup)',
        };

        const create_zalo_oa_body = req.body;
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
            create_zalo_oa_body.account_id = id;
            res.locals.create_zalo_oa_body = create_zalo_oa_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_zalo_oa_body = res.locals.create_zalo_oa_body as Create_Zalo_Oa_Body_Field;

        const my_response: My_Response_Field<Zalo_Oa_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Zalo_Oa-main)',
        };

        const mutateDB = new MutateDB_Create_Zalo_Oa();
        mutateDB.set_Create_Zalo_Oa_Body(create_zalo_oa_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                const data = result;
                my_response.message = 'Tạo zalo_oa thành công !';
                my_response.is_success = true;
                my_response.data = data;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo zalo_oa KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo zalo_oa KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Zalo_Oa;

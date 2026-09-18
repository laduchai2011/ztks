import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Create_Voucher_Body_Field } from '@src/data_struct/voucher/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Voucher from '../../mutateDB/Create_Voucher';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Voucher {
    setup = async (req: Request<any, any, Create_Voucher_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Voucher-setup)',
        };

        const create_voucher_body = req.body;
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
            create_voucher_body.member_ztks_id = id;
            res.locals.create_voucher_body = create_voucher_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_voucher_body = res.locals.create_voucher_body as Create_Voucher_Body_Field;

        const my_response: My_Response_Field<Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Voucher-main)',
        };

        const mutateDB = new MutateDB_Create_Voucher();
        mutateDB.set_Create_Voucher_Body(create_voucher_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo voucher thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo voucher KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo voucher KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Voucher;

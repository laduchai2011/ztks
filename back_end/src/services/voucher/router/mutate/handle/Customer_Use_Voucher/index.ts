import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Voucher_Field } from '@src/data_struct/voucher';
import { Customer_Use_Voucher_Body_Field } from '@src/data_struct/voucher/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Customer_Use_Voucher from '../../mutateDB/Customer_Use_Voucher';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Customer_Use_Voucher {
    setup = async (req: Request<any, any, Customer_Use_Voucher_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Customer_Use_Voucher-setup)',
        };

        const customer_use_voucher_body = req.body;
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
            customer_use_voucher_body.customer_id = id;
            res.locals.customer_use_voucher_body = customer_use_voucher_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const customer_use_voucher_body = res.locals.customer_use_voucher_body as Customer_Use_Voucher_Body_Field;

        const my_response: My_Response_Field<Voucher_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Customer_Use_Voucher-main)',
        };

        const mutateDB = new MutateDB_Customer_Use_Voucher();
        mutateDB.set_Customer_Use_Voucher_Body(customer_use_voucher_body);

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

export default Handle_Customer_Use_Voucher;

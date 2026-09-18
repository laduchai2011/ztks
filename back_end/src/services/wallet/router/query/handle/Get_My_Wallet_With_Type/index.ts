import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Wallet_Field } from '@src/data_struct/wallet';
import { Get_My_Wallet_With_Type_Body_Field } from '@src/data_struct/wallet/body';
import QueryDB_Get_My_Wallet_With_Type from '../../queryDB/Get_My_Wallet_With_Type';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_My_Wallet_With_Type {
    setup = (req: Request<any, any, Get_My_Wallet_With_Type_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Wallet_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_My_Wallet_With_Type-setup',
        };

        const get_my_wallet_with_type_body = req.body;
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
            get_my_wallet_with_type_body.account_id = id;
            res.locals.get_my_wallet_with_type_body = get_my_wallet_with_type_body;

            next();
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_my_wallet_with_type_body = res.locals
            .get_my_wallet_with_type_body as Get_My_Wallet_With_Type_Body_Field;

        const my_response: My_Response_Field<Wallet_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_My_Wallet_With_Type-main',
        };

        const queryDB = new QueryDB_Get_My_Wallet_With_Type();
        queryDB.set_Get_My_Wallet_With_Type_Body(get_my_wallet_with_type_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy ví thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy ví KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy ví KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_My_Wallet_With_Type;

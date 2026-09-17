import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Bank_Field } from '@src/data_struct/bank';
import { Get_All_Banks_Body_Field } from '@src/data_struct/bank/body';
import QueryDB_Get_All_Banks from '../../queryDB/Get_All_Banks';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_All_Banks {
    setup = (req: Request<any, any, Get_All_Banks_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Bank_Field[]> = {
            is_success: false,
        };

        const get_all_banks_body = req.body;
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
            get_all_banks_body.account_id = id;
            res.locals.get_all_banks_body = get_all_banks_body;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const get_all_banks_body = res.locals.get_all_banks_body as Get_All_Banks_Body_Field;

        const my_response: My_Response_Field<Bank_Field[]> = {
            is_success: false,
        };

        const queryDB = new QueryDB_Get_All_Banks();
        queryDB.set_Get_All_Banks_Body(get_all_banks_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy tất cả ngân hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy tất cả ngân hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy tất cả ngân hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_All_Banks;

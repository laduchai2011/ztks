import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Account_Information_Field } from '@src/data_struct/account';
import QueryDB_Get_Account_Information from '../../queryDB/Get_Account_Information';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Account_Information {
    setup = (req: Request, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Account_Information để lấy tài khoản admin hay thành viên (setup) !',
        };

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
            res.locals.account_id = id;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const account_id = res.locals.account_id as string;

        const my_response: My_Response_Field<Account_Information_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Get_Account_Information để lấy tài khoản admin hay thành viên (main) !',
        };

        const queryDB = new QueryDB_Get_Account_Information();
        queryDB.set_Account_Id(account_id);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy thông tin thành viên thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin thành viên KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin thành viên KHÔNG thành công 2 !';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Account_Information;

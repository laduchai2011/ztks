import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Customer_Field } from '@src/data_struct/customer';
import QueryDB_Customer_Get_Me from '../../queryDB/Get_Me';
import { verify_refresh_token } from '@src/token';

class Handle_Customer_Get_Me {
    setup = (req: Request, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Customer_Get_Me-setup!',
        };

        const { refreshToken } = req.cookies;

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
            res.locals.customer_id = id;

            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const customer_id = res.locals.customer_id as string;

        const my_response: My_Response_Field<Customer_Field> = {
            is_success: false,
            message: 'Bắt đầu Handle_Customer_Get_Me-main !',
        };

        const queryDB = new QueryDB_Customer_Get_Me();
        queryDB.set_Customer_Id(customer_id);

        try {
            const result = await queryDB.run();
            if (result) {
                const account: Customer_Field = { ...result };
                account.phone = '';
                account.password = '';
                my_response.data = account;
                my_response.message = 'Lấy thông tin người dùng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy thông tin người dùng KHÔNG thành công 1 !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy thông tin người dùng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Customer_Get_Me;

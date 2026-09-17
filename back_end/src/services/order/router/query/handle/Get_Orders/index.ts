import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Field, Paged_Order_Field } from '@src/data_struct/order';
import { Orders_Filter_Body_Field } from '@src/data_struct/order/body';
import QueryDB_Get_Orders from '../../queryDB/Get_Orders';
import { verify_refresh_token } from '@src/token';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Get_Orders {
    setup = async (req: Request<any, any, Orders_Filter_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Orders-setup)',
        };

        const orders_filter_body = req.body;
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
            orders_filter_body.account_id = id;
            res.locals.orders_filter_body = orders_filter_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const orders_filter_body = res.locals.orders_filter_body as Orders_Filter_Body_Field;

        const my_response: My_Response_Field<Paged_Order_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Get_Orders-main)',
        };

        const queryDB = new QueryDB_Get_Orders();
        queryDB.set_Orders_Filter_Body(orders_filter_body);

        try {
            const result = await queryDB.run();
            if (result) {
                my_response.data = result;
                my_response.message = 'Lấy những đơn hàng thành công !';
                my_response.is_success = true;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Lấy những đơn hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Lấy những đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Get_Orders;

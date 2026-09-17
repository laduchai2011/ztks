import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import MutateDB_Update_Order from '../../mutateDB/Update_Order';
import { verify_refresh_token } from '@src/token';
import { Order_Field } from '@src/data_struct/order';
import { Update_Order_Body_Field } from '@src/data_struct/order/body';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Update_Order {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    setup = async (req: Request<any, any, Update_Order_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Băt đầu (Handle_Update_Order-setup) !',
        };

        const update_order_body = req.body;
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
            update_order_body.account_id = id;
            res.locals.update_order_body = update_order_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const update_order_body = res.locals.update_order_body as Update_Order_Body_Field;

        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Băt đầu cập nhật (Handle_Update_Order-main) !',
        };

        const mutateDB = new MutateDB_Update_Order();
        mutateDB.set_Update_Order_Body(update_order_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Cập nhật đơn hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Cập nhật đơn hàng KHÔNG thành công !';
                res.status(200).json(my_response);
                return;
            }
        } catch (error) {
            console.error(error);
            my_response.message = 'Cập nhật đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Update_Order;

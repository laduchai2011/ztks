import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Status_Field } from '@src/data_struct/order';
import { Create_Order_Status_Body_Field } from '@src/data_struct/order/body';
import { verify_refresh_token } from '@src/token';
import MutateDB_Create_Order_Status from '../../mutateDB/Create_Order_Status';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Order_Status {
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._serviceRedis.init();
    }

    setup = async (req: Request<any, any, Create_Order_Status_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Order_Status_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order_Status-setup)',
        };

        const create_order_status_body = req.body;
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
            create_order_status_body.account_id = id;
            res.locals.create_order_status_body = create_order_status_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_order_status_body = res.locals.create_order_status_body as Create_Order_Status_Body_Field;

        const my_response: My_Response_Field<Order_Status_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order_Status-main)',
        };

        const mutateDB = new MutateDB_Create_Order_Status();
        mutateDB.set_Create_Order_Status_Body(create_order_status_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo trạng thái đơn hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo trạng thái đơn hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo trạng thái đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Order_Status;

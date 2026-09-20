import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_Field } from '@src/data_struct/order';
import { Create_Order_Body_Field } from '@src/data_struct/order/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Order from '../../mutateDB/Create_Order';
import { Cache_Get_Chat_Room_With_Id } from '@src/const/redisKey/chat_room';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_Create_Order {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomWithId = new Cache_Get_Chat_Room_With_Id({ log_prameter: 'Handle_Create_Order' });

    constructor() {
        this._serviceRedis.init();
        this._cacheGetChatRoomWithId.init();
    }

    setup = async (req: Request<any, any, Create_Order_Body_Field>, res: Response, next: NextFunction) => {
        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order-setup)',
        };

        const create_order_body = req.body;
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
            create_order_body.account_id = id;
            res.locals.create_order_body = create_order_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const create_order_body = res.locals.create_order_body as Create_Order_Body_Field;

        const my_response: My_Response_Field<Order_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order-main)',
        };

        const uuid = crypto.randomBytes(16).toString('hex');
        create_order_body.uuid = uuid;

        const mutateDB = new MutateDB_Create_Order();
        mutateDB.set_Create_Order_Body(create_order_body);

        try {
            const result = await mutateDB.run();
            if (result) {
                my_response.message = 'Tạo đơn hàng thành công !';
                my_response.is_success = true;
                my_response.data = result;
                res.status(200).json(my_response);
                return;
            } else {
                my_response.message = 'Tạo đơn hàng KHÔNG thành công !';
                res.status(204).json(my_response);
                return;
            }
        } catch (error) {
            my_response.message = 'Tạo đơn hàng KHÔNG thành công !!';
            my_response.err = error;
            res.status(500).json(my_response);
            return;
        }
    };
}

export default Handle_Create_Order;

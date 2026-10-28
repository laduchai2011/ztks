import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { My_Response_Field } from '@src/data_struct/response';
import { Order_V1_Field } from '@src/data_struct/order_v1';
import { Create_Order_V1_Body_Field } from '@src/data_struct/order_v1/body';
import { Create_Kafka_Event_Body_Field } from '@src/data_struct/kafka/body';
import { verify_Refresh_Token } from '@src/token';
import MutateDB_Create_Order_V1 from '../../mutateDB/Create_Order_V1';
import { Cache_Get_Chat_Room_With_Id } from '@src/const/redisKey/chat_room';
import { getRefreshToken } from '@src/device/getDevice';
import {
    Create_Order_V1_Inventory_Reservation_Body_Field,
    Create_Order_V1_Service_Body_Field,
} from '@src/data_struct/order_v1/body';

class Handle_Create_Order_V1 {
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetChatRoomWithId = new Cache_Get_Chat_Room_With_Id({ log_prameter: 'Handle_Create_Order' });

    constructor() {
        this._serviceRedis.init();
        this._cacheGetChatRoomWithId.init();
    }

    setup = async (
        req: Request<
            any,
            any,
            {
                create_order_v1_body: Create_Order_V1_Body_Field;
                payload: Create_Order_V1_Inventory_Reservation_Body_Field[] | Create_Order_V1_Service_Body_Field[];
            }
        >,
        res: Response,
        next: NextFunction
    ) => {
        const my_response: My_Response_Field<Order_V1_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order_V1-setup)',
        };

        const create_order_v1_body = req.body.create_order_v1_body;
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
            create_order_v1_body.created_account_id = id;
            res.locals.create_order_v1_body = create_order_v1_body;
            next();
            return;
        } else {
            my_response.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(my_response);
            return;
        }
    };

    main = async (
        req: Request<
            any,
            any,
            {
                create_order_v1_body: Create_Order_V1_Body_Field;
                payload: Create_Order_V1_Inventory_Reservation_Body_Field[] | Create_Order_V1_Service_Body_Field[];
            }
        >,
        res: Response
    ) => {
        const create_order_v1_body = res.locals.create_order_v1_body as Create_Order_V1_Body_Field;
        const payload = req.body.payload;

        const my_response: My_Response_Field<Order_V1_Field> = {
            is_success: false,
            message: 'Bắt đầu (Handle_Create_Order_V1-main)',
        };

        const mutateDB = new MutateDB_Create_Order_V1();
        mutateDB.set_Create_Order_V1_Body(create_order_v1_body);
        mutateDB.set_Payload(payload);

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

export default Handle_Create_Order_V1;

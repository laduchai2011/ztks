import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OrderStatusField } from '@src/dataStruct/order';
import { CreateOrderStatusBodyField } from '@src/dataStruct/order/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateOrderStatus from '../../mutateDB/CreateOrderStatus';

class Handle_CreateOrderStatus {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, CreateOrderStatusBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<OrderStatusField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateOrderStatus-setup)',
        };

        const createOrderStatusBody = req.body;
        const { refreshToken } = req.cookies;

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            const newCreateOrderStatusBody_cp = { ...createOrderStatusBody };
            newCreateOrderStatusBody_cp.accountId = id;
            res.locals.createOrderStatusBody = newCreateOrderStatusBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createOrderStatusBody = res.locals.createOrderStatusBody as CreateOrderStatusBodyField;

        const myResponse: MyResponse<OrderStatusField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateOrderStatus-main)',
        };

        const mutateDB = new MutateDB_CreateOrderStatus();
        mutateDB.setCreateOrderStatusBody(createOrderStatusBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Tạo trạng thái đơn hàng thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo trạng thái đơn hàng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo trạng thái đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateOrderStatus;

import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OrderField } from '@src/dataStruct/order';
import QueryDB_GetOrderWithId from '../../queryDB/GetOrderWithId';

class Handle_GetOrderWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = Number(req.query.id);

        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetOrderWithId-main !',
        };

        const queryDB = new QueryDB_GetOrderWithId();
        queryDB.setGetOrderWithIdBody({ id: id });

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const order: OrderField = { ...result?.recordset[0] };
                myResponse.data = order;
                myResponse.message = 'Lấy thông tin đơn hàng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin đơn hàng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetOrderWithId;

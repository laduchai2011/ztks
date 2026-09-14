import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OrderStatusField } from '@src/dataStruct/order';
import { GetAllOrderStatusBodyField } from '@src/dataStruct/order/body';
import QueryDB_GetAllOrderStatus from '../../queryDB/GetAllOrderStatus';

class Handle_GetAllOrderStatus {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<any, any, GetAllOrderStatusBodyField>, res: Response) => {
        const getAllOrderStatusBody = req.body;

        const myResponse: MyResponse<OrderStatusField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAllOrderStatus-main)',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetAllOrderStatus();
        queryDB.setGetAllOrderStatusBody(getAllOrderStatusBody);

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
                myResponse.data = result?.recordset;
                myResponse.message = 'Lấy tất cả trạng thái đơn hàng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tất cả trạng thái đơn hàng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tất cả trạng thái đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAllOrderStatus;

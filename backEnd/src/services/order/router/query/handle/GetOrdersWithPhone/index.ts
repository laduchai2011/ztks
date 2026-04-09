import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OrderField, PagedOrderField } from '@src/dataStruct/order';
import { GetOrdersWithPhoneBodyField } from '@src/dataStruct/order/body';
import QueryDB_GetOrdersWithPhone from '../../queryDB/GetOrdersWithPhone';

class Handle_GetOrdersWithPhone {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetOrdersWithPhoneBodyField>, res: Response) => {
        const getOrdersWithPhoneBody = req.body;

        const myResponse: MyResponse<PagedOrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetOrdersWithPhone-main)',
        };

        const queryDB = new QueryDB_GetOrdersWithPhone();
        queryDB.setGetOrdersWithPhoneBody(getOrdersWithPhoneBody);

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
            if (result?.recordset) {
                const rows: OrderField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những đơn hàng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những đơn hàng KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những đơn hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetOrdersWithPhone;

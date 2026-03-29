import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { OrderField, PagedOrderField } from '@src/dataStruct/order';
import { OrdersFilterBodyField } from '@src/dataStruct/order/body';
import QueryDB_GetOrders from '../../queryDB/GetOrders';
import { verifyRefreshToken } from '@src/token';

class Handle_GetOrders {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, OrdersFilterBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<OrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetOrders-setup)',
        };

        const ordersFilterBody = req.body;
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
            const newOrdersFilterBody_cp = { ...ordersFilterBody };
            newOrdersFilterBody_cp.accountId = id;
            res.locals.ordersFilterBody = newOrdersFilterBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const ordersFilterBody = res.locals.ordersFilterBody as OrdersFilterBodyField;

        const myResponse: MyResponse<PagedOrderField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetOrders-main)',
        };

        const queryDB = new QueryDB_GetOrders();
        queryDB.setOrdersFilterBody(ordersFilterBody);

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

export default Handle_GetOrders;

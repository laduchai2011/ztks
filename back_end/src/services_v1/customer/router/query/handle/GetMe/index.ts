import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CustomerField } from '@src/dataStruct/customer';
import QueryDB_CustomerGetMe from '../../queryDB/GetMe';
import { verifyRefreshToken } from '@src/token';

class Handle_CustomerGetMe {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<CustomerField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_CustomerGetMe-setup!',
        };

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
            res.locals.customertId = id;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const customertId = res.locals.customertId as number;

        const myResponse: MyResponse<CustomerField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_CustomerGetMe-main !',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_CustomerGetMe();
        queryDB.setCustomerId(customertId);

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
                const account: CustomerField = { ...result?.recordset[0] };
                account.phone = '';
                account.password = '';
                myResponse.data = account;
                myResponse.message = 'Lấy thông tin người dùng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin người dùng KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin người dùng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CustomerGetMe;

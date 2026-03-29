import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import QueryDB_GetMe from '../../queryDB/GetMe';
import { verifyRefreshToken } from '@src/token';

class Handle_GetMe {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetMe để lấy tài khoản admin hay thành viên (setup) !',
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
            res.locals.accountId = id;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const accountId = res.locals.accountId as number;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetMe để lấy tài khoản admin hay thành viên (main) !',
        };

        await this._mssql_server.init();

        const queryDB_getMe = new QueryDB_GetMe();
        queryDB_getMe.setAccountId(accountId);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB_getMe.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB_getMe.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const account: AccountField = { ...result?.recordset[0] };
                account.userName = '';
                account.password = '';
                account.phone = '';
                myResponse.data = account;
                myResponse.message = 'Lấy thông tin thành viên thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin thành viên KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin thành viên KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMe;

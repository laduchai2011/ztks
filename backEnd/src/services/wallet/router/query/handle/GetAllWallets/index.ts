import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField } from '@src/dataStruct/wallet';
import { GetAllWalletsBodyField } from '@src/dataStruct/wallet/body';
import QueryDB_GetAllWallets from '../../queryDB/GetAllWallets';
import { verifyRefreshToken } from '@src/token';

class Handle_GetAllWallets {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = (req: Request<any, any, GetAllWalletsBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<WalletField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetAllWallets-setup',
        };

        const getAllWalletsBody = req.body;
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
            const getAllWalletsBody_cp = { ...getAllWalletsBody };
            getAllWalletsBody_cp.accountId = id;
            res.locals.getAllWalletsBody = getAllWalletsBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getAllWalletsBody = res.locals.getAllWalletsBody as GetAllWalletsBodyField;

        const myResponse: MyResponse<WalletField[]> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetAllWallets-main',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetAllWallets();
        queryDB.setGetAllWalletsBody(getAllWalletsBody);

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
                myResponse.message = 'Lấy tất cả ví thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tất cả ví KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tất cả ví KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAllWallets;

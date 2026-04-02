import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField } from '@src/dataStruct/wallet';
import { CreateWalletBodyField } from '@src/dataStruct/wallet/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateWallet from '../../mutateDB/CreateWallet';

class Handle_CreateWallet {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, CreateWalletBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<WalletField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateWallet-setup)',
        };

        const createWalletBody = req.body;
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
            const newCreateWalletBody_cp = { ...createWalletBody };
            newCreateWalletBody_cp.accountId = id;
            res.locals.createWalletBody = newCreateWalletBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createWalletBody = res.locals.createWalletBody as CreateWalletBodyField;

        const myResponse: MyResponse<WalletField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateWallet-main)',
        };

        const mutateDB = new MutateDB_CreateWallet();
        mutateDB.setCreateWalletBody(createWalletBody);

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

                myResponse.message = 'Tạo ví thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo ví KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo ví KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateWallet;

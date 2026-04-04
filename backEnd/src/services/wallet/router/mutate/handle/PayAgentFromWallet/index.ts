import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { WalletField } from '@src/dataStruct/wallet';
import { PayAgentFromWalletBodyField } from '@src/dataStruct/wallet/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_PayAgentFromWallet from '../../mutateDB/PayAgentFromWallet';

class Handle_PayAgentFromWallet {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (req: Request<any, any, PayAgentFromWalletBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<WalletField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_PayAgentFromWallet-setup)',
        };

        const payAgentFromWalletBody = req.body;
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
            const payAgentFromWalletBody_cp = { ...payAgentFromWalletBody };
            payAgentFromWalletBody_cp.accountId = id;
            res.locals.payAgentFromWalletBody = payAgentFromWalletBody_cp;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const payAgentFromWalletBody = res.locals.payAgentFromWalletBody as PayAgentFromWalletBodyField;

        const myResponse: MyResponse<WalletField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_PayAgentFromWallet-main)',
        };

        const mutateDB = new MutateDB_PayAgentFromWallet();
        mutateDB.setPayAgentFromWalletBody(payAgentFromWalletBody);

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
                myResponse.message = 'Thanh toán agent thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Thanh toán agent KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Thanh toán agent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_PayAgentFromWallet;

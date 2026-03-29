import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AgentPayField } from '@src/dataStruct/agent';
import { GetLastAgentPayBodyField } from '@src/dataStruct/agent/body';
import QueryDB_GetLastAgentPay from '../../queryDB/GetLastAgentPay';
import { verifyRefreshToken } from '@src/token';

class Handle_GetLastAgentPay {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = (req: Request<any, any, GetLastAgentPayBodyField>, res: Response, next: NextFunction) => {
        const getLastAgentPayBody = req.body;
        const { refreshToken } = req.cookies;

        const myResponse: MyResponse<AgentPayField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetLastAgentPay-setup)',
        };

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
            const getLastAgentPayBody_cp = { ...getLastAgentPayBody };
            getLastAgentPayBody_cp.accountId = id;
            res.locals.getLastAgentPayBody = getLastAgentPayBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getLastAgentPayBody = res.locals.getLastAgentPayBody as GetLastAgentPayBodyField;

        const myResponse: MyResponse<AgentPayField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetLastAgentPay-main !',
        };

        const queryDB = new QueryDB_GetLastAgentPay();
        queryDB.setGetLastAgentPayBody(getLastAgentPayBody);

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
                myResponse.data = result?.recordset[0];
                myResponse.message = 'Lấy thông tin last-pay thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin last-pay KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin last-pay KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetLastAgentPay;

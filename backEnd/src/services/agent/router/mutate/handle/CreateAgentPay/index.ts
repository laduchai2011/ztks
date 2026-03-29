import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AgentPayField } from '@src/dataStruct/agent';
import { CreateAgentPayBodyField } from '@src/dataStruct/agent/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateAgentPay from '../../mutateDB/CreateAgentPay';

class Handle_CreateAgentPay {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, CreateAgentPayBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AgentPayField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateAgentPay-setup)',
        };

        const createAgentPayBody = req.body;
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
            const createAgentPayBody_cp = { ...createAgentPayBody };
            createAgentPayBody_cp.accountId = id;
            res.locals.createAgentPayBody = createAgentPayBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createAgentPayBody = res.locals.createAgentPayBody as CreateAgentPayBodyField;

        const myResponse: MyResponse<AgentPayField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateAgentPay-main)',
        };

        const mutateDB = new MutateDB_CreateAgentPay();
        mutateDB.setCreateAgentPayBody(createAgentPayBody);

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
                myResponse.message = 'Tạo agentPay thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo agentPay KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo agentPay KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateAgentPay;

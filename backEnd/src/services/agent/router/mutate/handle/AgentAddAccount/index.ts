import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AgentField } from '@src/dataStruct/agent';
import { AgentAddAccountBodyField } from '@src/dataStruct/agent/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_AgentAddAccount from '../../mutateDB/AgentAddAccount';

class Handle_AgentAddAccount {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, AgentAddAccountBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AgentAddAccount-setup)',
        };

        const agentAddAccountBody = req.body;
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
            const agentAddAccountBody_cp = { ...agentAddAccountBody };
            agentAddAccountBody_cp.accountId = id;
            res.locals.agentAddAccountBody = agentAddAccountBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const agentAddAccountBody = res.locals.agentAddAccountBody as AgentAddAccountBodyField;

        const myResponse: MyResponse<AgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_AgentAddAccount-main)',
        };

        const mutateDB = new MutateDB_AgentAddAccount();
        mutateDB.setAgentAddAccountBody(agentAddAccountBody);

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
                myResponse.message = 'Chỉ định thành viên cho agent thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Chỉ định thành viên cho agent KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Chỉ định thành viên cho agent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_AgentAddAccount;

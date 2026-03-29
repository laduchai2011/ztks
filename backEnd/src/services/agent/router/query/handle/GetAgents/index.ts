import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AgentField, PagedAgentField } from '@src/dataStruct/agent';
import { GetAgentsBodyField } from '@src/dataStruct/agent/body';
import QueryDB_GetMembers from '../../queryDB/GetAgents';
import { verifyRefreshToken } from '@src/token';

class Handle_GetAgents {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    setup = (req: Request<any, any, GetAgentsBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<PagedAgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAgents-setup)',
        };

        const getAgentsBody = req.body;
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
            const getAgentsBody_cp = { ...getAgentsBody };
            getAgentsBody_cp.accountId = id;
            res.locals.getAgentsBody = getAgentsBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getAgentsBody = res.locals.getAgentsBody as GetAgentsBodyField;

        const myResponse: MyResponse<PagedAgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAgents-main)',
        };

        const queryDB = new QueryDB_GetMembers();
        queryDB.setGetAgentsBody(getAgentsBody);

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
                const rows: AgentField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những agent thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những agent KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những agent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAgents;

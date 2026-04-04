import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AgentField } from '@src/dataStruct/agent';
import { GetAgentWithAgentAccountIdBodyField } from '@src/dataStruct/agent/body';
import QueryDB_GetAgentWithAgentAccountId from '../../queryDB/GetAgentWithAgentAccountId';

class Handle_GetAgentWithAgentAccountId {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetAgentWithAgentAccountIdBodyField>, res: Response) => {
        const getAgentWithAgentAccountIdBody = req.body;

        const myResponse: MyResponse<AgentField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetAgentWithAgentAccountId-main !',
        };

        const queryDB = new QueryDB_GetAgentWithAgentAccountId();
        queryDB.setGetAgentWithAgentAccountIdBody(getAgentWithAgentAccountIdBody);

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
                const agent: AgentField = { ...result?.recordset[0] };

                myResponse.data = agent;
                myResponse.message = 'Lấy thông tin agent thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin agent KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin agent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAgentWithAgentAccountId;

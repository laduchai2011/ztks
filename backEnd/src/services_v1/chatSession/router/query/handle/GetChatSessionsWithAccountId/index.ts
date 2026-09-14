import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedChatSessionField, ChatSessionField } from '@src/dataStruct/chatSession';
import { ChatSessionWithAccountIdBodyField } from '@src/dataStruct/chatSession/body';
import QueryDB_GetChatSessionsWithAccountId from '../../queryDB/GetChatSessionsWithAccountId';

class Handle_GetChatSessionsWithAccountId {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, ChatSessionWithAccountIdBodyField>, res: Response) => {
        const chatSessionWithAccountIdBody = req.body;

        const myResponse: MyResponse<PagedChatSessionField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatSessionsWithAccountId-main)',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetChatSessionsWithAccountId();
        queryDB.setChatSessionWithAccountIdBody(chatSessionWithAccountIdBody);

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
                const rows: ChatSessionField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy phiên chat thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy phiên chat KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy phiên chat KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetChatSessionsWithAccountId;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedMessageField, MessageField, MessageBodyField } from '@src/dataStruct/message';
import QueryDB_GetMessages from '../../queryDB/GetMessages';

class Handle_GetMessages {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, MessageBodyField>, res: Response) => {
        const messageBody = req.body;

        const myResponse: MyResponse<PagedMessageField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const queryDB_getMessages = new QueryDB_GetMessages();
        queryDB_getMessages.setMessageBody(messageBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB_getMessages.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await queryDB_getMessages.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const rows: MessageField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy tin nhắn thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tin nhắn KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tin nhắn KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMessages;

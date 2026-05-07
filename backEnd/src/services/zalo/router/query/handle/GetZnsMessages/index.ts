import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedZnsMessageField, ZnsMessageField } from '@src/dataStruct/zalo';
import { GetZnsMessagesBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZnsMessages from '../../queryDB/GetZnsMessages';

class Handle_GetZnsMessages {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetZnsMessagesBodyField>, res: Response) => {
        const getZnsMessagesBody = req.body;

        const myResponse: MyResponse<PagedZnsMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZnsTemplates-main)',
        };

        const queryDB = new QueryDB_GetZnsMessages();
        queryDB.setGetZnsMessagesBody(getZnsMessagesBody);

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
                const rows: ZnsMessageField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy tin zns thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy tin zns KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy tin zns KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZnsMessages;

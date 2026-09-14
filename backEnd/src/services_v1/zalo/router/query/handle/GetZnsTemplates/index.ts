import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { PagedZnsTemplateField, ZnsTemplateField } from '@src/dataStruct/zalo';
import { GetZnsTemplatesBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZnsTemplates from '../../queryDB/GetZnsTemplates';

class Handle_GetZnsTemplates {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetZnsTemplatesBodyField>, res: Response) => {
        const getZnsTemplatesBody = req.body;

        const myResponse: MyResponse<PagedZnsTemplateField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZnsTemplates-main)',
        };

        const queryDB = new QueryDB_GetZnsTemplates();
        queryDB.setGetZnsTemplatesBody(getZnsTemplatesBody);

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
                const rows: ZnsTemplateField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy mẫu zns thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy mẫu zns KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy mẫu zns KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZnsTemplates;

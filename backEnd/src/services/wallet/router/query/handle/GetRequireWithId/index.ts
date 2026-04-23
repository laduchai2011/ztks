import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { GetRequireWithIdBodyField } from '@src/dataStruct/wallet/body';
import QueryDB_GetRequireWithId from '../../queryDB/GetRequireWithId';

class Handle_GetRequireWithId {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<any, any, GetRequireWithIdBodyField>, res: Response) => {
        const getRequireWithIdBody = req.body;

        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetRequireWithId-main',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_GetRequireWithId();
        queryDB.setGetRequireWithIdBody(getRequireWithIdBody);

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
                myResponse.message = 'Lấy yêu cầu tút tiền thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy yêu cầu tút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy yêu cầu tút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetRequireWithId;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetMyCheckInOutsBodyField } from '@src/dataStruct/checkInOut/body';
import QueryDB_GetMyCheckInOuts from '../../queryDB/GetMyCheckInOuts';

class Handle_GetMyCheckInOuts {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetMyCheckInOutsBodyField>, res: Response) => {
        const getMyCheckInOutsBody = req.body;

        const myResponse: MyResponse<CheckInOutField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMyCheckInOuts-main)',
        };

        const queryDB = new QueryDB_GetMyCheckInOuts();
        queryDB.setGetMyCheckInOutsBody(getMyCheckInOutsBody);

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
                myResponse.data = result.recordset;
                myResponse.message = 'Lấy những CheckInOut thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những CheckInOut KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những CheckInOut KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMyCheckInOuts;

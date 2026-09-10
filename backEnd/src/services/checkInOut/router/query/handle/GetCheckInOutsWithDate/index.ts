import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CheckInOutField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutsWithDateBodyField } from '@src/dataStruct/checkInOut/body';
import QueryDB_GetCheckInOutsWithDate from '../../queryDB/GetCheckInOutsWithDate';

class Handle_GetCheckInOutsWithDate {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetCheckInOutsWithDateBodyField>, res: Response) => {
        const getCheckInOutsWithDateBody = req.body;

        const myResponse: MyResponse<CheckInOutField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMyCheckInOuts-main)',
        };

        const queryDB = new QueryDB_GetCheckInOutsWithDate();
        queryDB.setGetCheckInOutsWithDateBody(getCheckInOutsWithDateBody);

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

export default Handle_GetCheckInOutsWithDate;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CheckInOutInspectField } from '@src/dataStruct/checkInOut';
import { GetCheckInOutInspectWithFkBodyField } from '@src/dataStruct/checkInOut/body';
import QueryDB_GetCheckInOutInspectWithFk from '../../queryDB/GetCheckInOutInspectWithFk';

class Handle_GetCheckInOutInspectWithFk {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetCheckInOutInspectWithFkBodyField>, res: Response) => {
        const getCheckInOutInspectWithFkBody = req.body;

        const myResponse: MyResponse<CheckInOutInspectField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetCheckInOutInspectWithFk-main !',
        };

        const queryDB = new QueryDB_GetCheckInOutInspectWithFk();
        queryDB.setGetCheckInOutInspectWithFkBody(getCheckInOutInspectWithFkBody);

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
                const order: CheckInOutInspectField = { ...result?.recordset[0] };
                myResponse.data = order;
                myResponse.message = 'Lấy thông tin duyệt check in/out thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin duyệt check in/out KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin duyệt check in/out KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetCheckInOutInspectWithFk;

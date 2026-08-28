import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { StatisticsField } from '@src/dataStruct/statistics';
import { GetStatisticsBodyField } from '@src/dataStruct/statistics/body';
import QueryDB_GetStatistics from '../../queryDB/GetStatistics';

class Handle_GetStatistics {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetStatisticsBodyField>, res: Response) => {
        const getStatisticsBody = req.body;

        const myResponse: MyResponse<StatisticsField[]> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetStatistics-main)',
        };

        const queryDB = new QueryDB_GetStatistics();
        queryDB.setGetStatisticsBody(getStatisticsBody);

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
                myResponse.message = 'Lấy thống kê thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thống kê KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thống kê KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetStatistics;

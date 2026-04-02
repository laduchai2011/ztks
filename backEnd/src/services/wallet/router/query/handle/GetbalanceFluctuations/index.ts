import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { BalanceFluctuationField, PagedBalanceFluctuationField } from '@src/dataStruct/wallet';
import { GetbalanceFluctuationsBodyField } from '@src/dataStruct/wallet/body';
import QueryDB_GetbalanceFluctuations from '../../queryDB/GetbalanceFluctuations';

class Handle_GetbalanceFluctuations {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetbalanceFluctuationsBodyField>, res: Response) => {
        const getbalanceFluctuationsBody = req.body;

        const myResponse: MyResponse<PagedBalanceFluctuationField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetbalanceFluctuations-main)',
        };

        const queryDB = new QueryDB_GetbalanceFluctuations();
        queryDB.setGetbalanceFluctuationsBody(getbalanceFluctuationsBody);

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
            if (result?.recordset) {
                const rows: BalanceFluctuationField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những biến động số dư thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những biến động số dư KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những biến động số dư KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetbalanceFluctuations;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { BankField } from '@src/dataStruct/bank';
import { GetBankWithIdBodyField } from '@src/dataStruct/bank/body';
import QueryDB_GetBankWithId from '../../queryDB/GetBankWithId';

class Handle_GetBankWithId {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetBankWithIdBodyField>, res: Response) => {
        const getBankWithIdBody = req.body;

        const myResponse: MyResponse<BankField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetBankWithId-main !',
        };

        const queryDB = new QueryDB_GetBankWithId();
        queryDB.setGetBankWithIdBodyField(getBankWithIdBody);

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
                const bank: BankField = { ...result?.recordset[0] };
                myResponse.data = bank;
                myResponse.message = 'Lấy thông tin ngân hàng thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin ngân hàng KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin ngân hàng KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetBankWithId;

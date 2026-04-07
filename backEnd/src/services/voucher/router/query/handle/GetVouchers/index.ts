import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { VoucherField, PagedVoucherField } from '@src/dataStruct/voucher';
import { GetVouchersBodyField } from '@src/dataStruct/voucher/body';
import QueryDB_GetVouchers from '../../queryDB/GetVouchers';

class Handle_GetVouchers {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetVouchersBodyField>, res: Response) => {
        const getVouchersBody = req.body;

        const myResponse: MyResponse<PagedVoucherField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAgents-main)',
        };

        const queryDB = new QueryDB_GetVouchers();
        queryDB.setGetVouchersBody(getVouchersBody);

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
                const rows: VoucherField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những voucher thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những voucher KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những voucher KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetVouchers;

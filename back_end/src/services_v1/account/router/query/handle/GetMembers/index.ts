import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField, PagedAccountField } from '@src/dataStruct/account';
import { GetMembersBodyField } from '@src/dataStruct/account/body';
import QueryDB_GetMembers from '../../queryDB/GetMembers';

class Handle_GetMembers {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, GetMembersBodyField>, res: Response) => {
        const getMembersBody = req.body;

        const myResponse: MyResponse<PagedAccountField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetMembers-main)',
        };

        const queryDB = new QueryDB_GetMembers();
        queryDB.setGetMembersBody(getMembersBody);

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
                const rows: AccountField[] = result.recordset;
                myResponse.data = { items: rows, totalCount: result.recordsets[1][0].totalCount };
                myResponse.message = 'Lấy những thành viên thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy những thành viên KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy những thành viên KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetMembers;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberGetRequireTakeMoneyOfWalletBodyField } from '@src/dataStruct/wallet/body';
import QueryDB_MemberGetRequireTakeMoneyOfWallet from '../../queryDB/MemberGetRequireTakeMoneyOfWallet';

class Handle_MemberGetRequireTakeMoneyOfWallet {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<any, any, MemberGetRequireTakeMoneyOfWalletBodyField>, res: Response) => {
        const memberGetRequireTakeMoneyOfWalletBody = req.body;

        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_MemberGetRequireTakeMoneyOfWallet-main',
        };

        await this._mssql_server.init();

        const queryDB = new QueryDB_MemberGetRequireTakeMoneyOfWallet();
        queryDB.setMemberGetRequireTakeMoneyOfWalletBody(memberGetRequireTakeMoneyOfWalletBody);

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
                myResponse.message = 'Lấy yêu cầu rút tiền thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy yêu cầu rút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_MemberGetRequireTakeMoneyOfWallet;

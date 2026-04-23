import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { MemberZtksConfirmTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import MutateDB_MemberZtksConfirmTakeMoney from '../../mutateDB/MemberZtksConfirmTakeMoney';

class Handle_MemberZtksConfirmTakeMoney {
    private _mssql_server = mssql_server;

    constructor() {
        this._mssql_server.init();
    }

    main = async (req: Request<any, any, MemberZtksConfirmTakeMoneyBodyField>, res: Response) => {
        const memberZtksConfirmTakeMoneyBody = req.body;

        const myResponse: MyResponse<RequireTakeMoneyField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_MemberZtksConfirmTakeMoney-main)',
        };

        const mutateDB = new MutateDB_MemberZtksConfirmTakeMoney();
        mutateDB.setMemberZtksConfirmTakeMoneyBody(memberZtksConfirmTakeMoneyBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];

                myResponse.message = 'Xác nhận yêu cầu rút tiền thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Xác nhận yêu cầu rút tiền KHÔNG thành công !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Xác nhận yêu cầu rút tiền KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_MemberZtksConfirmTakeMoney;

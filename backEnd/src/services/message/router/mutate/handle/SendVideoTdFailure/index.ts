import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageField, SendVideoTdFailureBodyField } from '@src/dataStruct/message';
import MutateDB_SendVideoTdFailure from '../../mutateDB/SendVideoTdFailure';

class Handle_SendVideoTdFailure {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, SendVideoTdFailureBodyField>, res: Response) => {
        const sendVideoTdFailureBody = req.body;

        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_SendVideoTdFailure) !',
        };

        await this._mssql_server.init();

        const mutateDB_sendVideoTdFailure = new MutateDB_SendVideoTdFailure();
        mutateDB_sendVideoTdFailure.setSendVideoTdFailureBody(sendVideoTdFailureBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_sendVideoTdFailure.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_sendVideoTdFailure.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Cập nhật trạng thái SendVideoTdFailure thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật trạng thái SendVideoTdFailure KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Cập nhật trạng thái SendVideoTdFailure KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_SendVideoTdFailure;

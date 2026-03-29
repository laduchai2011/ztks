import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageField, SendVideoTdSuccessBodyField } from '@src/dataStruct/message';
import MutateDB_SendVideoTdSuccess from '../../mutateDB/SendVideoTdSuccess';

class Handle_SendVideoTdFailure {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, SendVideoTdSuccessBodyField>, res: Response) => {
        const sendVideoTdSuccessBody = req.body;

        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật (Handle_SendVideoTdSuccess) !',
        };

        await this._mssql_server.init();

        const mutateDB_sendVideoTdSuccess = new MutateDB_SendVideoTdSuccess();
        mutateDB_sendVideoTdSuccess.setSendVideoTdSuccessBody(sendVideoTdSuccessBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_sendVideoTdSuccess.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_sendVideoTdSuccess.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Cập nhật trạng thái SendVideoTdSuccess thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật trạng thái SendVideoTdSuccess KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Cập nhật trạng thái SendVideoTdSuccess KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_SendVideoTdFailure;

import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { DelIsNewMessageBodyField } from '@src/dataStruct/myCustomer';
import MutateDB_DelIsNewMessage from '../../mutateDB/DelIsNewMessage';

class Handle_DelIsNewMessage {
    private _mssql_server = mssql_server;

    constructor() {}

    main = async (req: Request<Record<string, never>, unknown, DelIsNewMessageBodyField>, res: Response) => {
        const delIsNewMessageBody = req.body;

        const myResponse: MyResponse<any> = {
            isSuccess: false,
        };

        const mutateDB_delIsNewMessage = new MutateDB_DelIsNewMessage();
        mutateDB_delIsNewMessage.setDelIsNewMessageBody(delIsNewMessageBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_delIsNewMessage.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB_delIsNewMessage.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                // produceTask<OrderField>('addOrder-to-provider', data);
                myResponse.message = 'Xóa IsNewMessage thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Xóa IsNewMessage KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Xóa IsNewMessage KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_DelIsNewMessage;

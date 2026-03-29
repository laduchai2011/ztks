import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageField, CreateMessageBodyField } from '@src/dataStruct/message';
import { verifyRefreshToken } from '@src/token';
import MutateDB_CreateMessage from '../../mutateDB/CreateMessage';
// import { produceTask } from '@src/queueRedis/producer';

class Handle_CreateMessage {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = async (
        req: Request<Record<string, never>, unknown, CreateMessageBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
        };

        await this._mssql_server.init();

        const createMessageBody = req.body;
        const { refreshToken } = req.cookies;

        if (typeof refreshToken === 'string') {
            const verify_refreshToken = verifyRefreshToken(refreshToken);

            if (verify_refreshToken === 'invalid') {
                myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            if (verify_refreshToken === 'expired') {
                myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
                res.status(500).json(myResponse);
                return;
            }

            const { id } = verify_refreshToken;
            const newCreateMessageBody_cp = { ...createMessageBody };
            newCreateMessageBody_cp.accountId = id;
            res.locals.createMessageBody = newCreateMessageBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const createMessageBody = res.locals.createMessageBody as CreateMessageBodyField;

        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
        };

        const mutateDB_createMessage = new MutateDB_CreateMessage();
        mutateDB_createMessage.setCreateMessageBody(createMessageBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_createMessage.set_connection_pool(connection_pool);
        } else {
            myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
            res.status(500).json(myResponse);
            return;
        }

        try {
            const result = await mutateDB_createMessage.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                // produceTask<OrderField>('addOrder-to-provider', data);
                myResponse.message = 'Tạo tin nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Tạo tin nhắn KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Tạo tin nhắn KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateMessage;

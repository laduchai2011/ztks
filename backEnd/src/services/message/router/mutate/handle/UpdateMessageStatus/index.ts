import { mssql_server } from '@src/connect';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MessageField, UpdateMessageStatusBodyField } from '@src/dataStruct/message';
import MutateDB_UpdateMessageStatus from '../../mutateDB/UpdateMessageStatus';
import { verifyRefreshToken } from '@src/token';

class Handle_UpdateMessageStatus {
    private _mssql_server = mssql_server;

    constructor() {}

    setup = async (
        req: Request<Record<string, never>, unknown, UpdateMessageStatusBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
            message: 'Băt đầu thiết lập !',
        };

        await this._mssql_server.init();

        const updateMessageStatusBody = req.body;
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
            const updateMessageStatusBody_cp = { ...updateMessageStatusBody };
            updateMessageStatusBody_cp.accountId = id;
            res.locals.updateMessageStatusBody = updateMessageStatusBody_cp;

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const updateMessageStatusBody = res.locals.updateMessageStatusBody as UpdateMessageStatusBodyField;

        const myResponse: MyResponse<MessageField> = {
            isSuccess: false,
            message: 'Băt đầu cập nhật !',
        };

        await this._mssql_server.init();

        const mutateDB_updateMessageStatus = new MutateDB_UpdateMessageStatus();
        mutateDB_updateMessageStatus.setUpdateMessageStatusBody(updateMessageStatusBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            mutateDB_updateMessageStatus.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
        }

        try {
            const result = await mutateDB_updateMessageStatus.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const data = result.recordset[0];
                myResponse.message = 'Cập nhật trạng thái nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Cập nhật trạng thái tin nhắn KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Cập nhật trạng thái tin nhắn KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_UpdateMessageStatus;

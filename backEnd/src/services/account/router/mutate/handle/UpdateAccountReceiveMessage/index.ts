import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { UpdateAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';
import { verifyRefreshToken } from '@src/token';
import MutateDB_UpdateAccountReceiveMessage from '../../mutateDB/UpdateAccountReceiveMessage';
import { prefix_cache_accountReceiveMessage } from '@src/const/redisKey/account';

class Handle_UpdateAccountReceiveMessage {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = async (
        req: Request<Record<string, never>, unknown, UpdateAccountReceiveMessageBodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const myResponse: MyResponse<AccountReceiveMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_UpdateAccountReceiveMessage-setup)',
        };

        const updateAccountReceiveMessageBody = req.body;
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
            const updateAccountReceiveMessageBody_cp = { ...updateAccountReceiveMessageBody };
            updateAccountReceiveMessageBody_cp.accountId = id;
            res.locals.updateAccountReceiveMessageBody = updateAccountReceiveMessageBody_cp;

            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const updateAccountReceiveMessageBody = res.locals
            .updateAccountReceiveMessageBody as UpdateAccountReceiveMessageBodyField;
        const accountId = updateAccountReceiveMessageBody.accountId;

        const myResponse: MyResponse<AccountReceiveMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_UpdateAccountReceiveMessage-main)',
        };

        const mutateDB = new MutateDB_UpdateAccountReceiveMessage();
        mutateDB.setUpdateAccountReceiveMessageBody(updateAccountReceiveMessageBody);

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

                const keyRedis = `${prefix_cache_accountReceiveMessage.key.with_accountId}_${accountId}`;
                const isDel = this._serviceRedis.deleteData(keyRedis);
                if (!isDel) {
                    console.error('Failed to delete key in Redis', keyRedis);
                }

                myResponse.message = 'Thiết lập tài khoản nhận tin nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = data;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Thiết lập tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Thiết lập tài khoản nhận tin nhắn KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_UpdateAccountReceiveMessage;

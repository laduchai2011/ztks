import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import QueryDB_GetAccountReceiveMessage from '../../queryDB/GetAccountReceiveMessage';
import { AccountReceiveMessageField } from '@src/dataStruct/account';
import { GetAccountReceiveMessageBodyField } from '@src/dataStruct/account/body';
import { MyResponse } from '@src/dataStruct/response';
import { prefix_cache_accountReceiveMessage } from '@src/const/redisKey/account';

class Handle_GetAccountReceiveMessage {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<Record<string, never>, unknown, GetAccountReceiveMessageBodyField>, res: Response) => {
        const getAccountReceiveMessageBody = req.body;
        const accountId = getAccountReceiveMessageBody.accountId;

        const myResponse: MyResponse<AccountReceiveMessageField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetAccountReceiveMessage-main)',
        };

        const keyRedis = `${prefix_cache_accountReceiveMessage.key.with_accountId}_${accountId}`;
        const timeExpireat = prefix_cache_accountReceiveMessage.time;

        const accountReceiveMessage_redis = await this._serviceRedis.getData<AccountReceiveMessageField>(keyRedis);
        if (accountReceiveMessage_redis) {
            myResponse.data = accountReceiveMessage_redis;
            myResponse.message = 'Lấy thông tin tài khoản nhận tin nhắn thành công !.';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetAccountReceiveMessage();
        queryDB.setGetAccountReceiveMessageBody(getAccountReceiveMessageBody);

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
                const rData = result.recordset[0];
                const isSet = await this._serviceRedis.setData<AccountReceiveMessageField>(
                    keyRedis,
                    rData,
                    timeExpireat
                );
                if (!isSet) {
                    console.error('Failed to set thông tin tài khoản nhận tin nhắn in Redis', keyRedis);
                }
                myResponse.message = 'Lấy thông tin tài khoản nhận tin nhắn thành công !';
                myResponse.isSuccess = true;
                myResponse.data = rData;
                res.json(myResponse);
            } else {
                myResponse.message = 'Lấy thông tin tài khoản nhận tin nhắn KHÔNG thành công !';
                res.status(200).json(myResponse);
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin tài khoản nhận tin nhắn thất bại !!';
            myResponse.err = error;
            res.status(200).json(myResponse);
        }
    };
}

export default Handle_GetAccountReceiveMessage;

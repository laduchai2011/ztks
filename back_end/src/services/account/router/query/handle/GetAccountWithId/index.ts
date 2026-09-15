import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { AccountField } from '@src/dataStruct/account';
import QueryDB_GetAccountWithId from '../../queryDB/GetAccountWithId';
import { prefix_cache_account } from '@src/const/redisKey/account';

class Handle_GetAccountWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    main = async (req: Request<any, any, any, { id: string }>, res: Response) => {
        const id = req.query.id;

        const myResponse: MyResponse<AccountField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetMe để lấy tài khoản admin hay thành viên (main) !',
        };

        const keyDataRedis = `${prefix_cache_account.key.with_id}_${id}`;
        const timeExpireat = prefix_cache_account.time;
        const account_redis = await this._serviceRedis.getData<AccountField>(keyDataRedis);
        if (account_redis) {
            myResponse.data = account_redis;
            myResponse.message = 'Lấy thông tin tài khoản thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetAccountWithId();
        queryDB.setAccountId(Number(id));

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
                const account: AccountField = { ...result?.recordset[0] };
                account.userName = '';
                account.password = '';
                account.phone = '';

                const isSetData = await this._serviceRedis.setData<AccountField>(keyDataRedis, account, timeExpireat);
                if (!isSetData) {
                    console.error('Failed to set thông tin tài khoản in Redis', keyDataRedis);
                }

                myResponse.data = account;
                myResponse.message = 'Lấy thông tin tài khoản thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin tài khoản KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin tài khoản KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetAccountWithId;

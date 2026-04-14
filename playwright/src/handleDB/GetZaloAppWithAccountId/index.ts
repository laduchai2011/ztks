import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField } from '@src/dataStruct/zalo/body';
import { accountType_enum } from '@src/dataStruct/account';
import { prefix_cache_zaloApp } from '@src/const/redisKey/zalo';
import QueryDB_GetZaloAppWithAccountId from '../../qmdb/queryDB/GetZaloAppWithAccountId';

class Handle_GetZaloAppWithAccountId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _zaloApp: ZaloAppField | undefined;

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (zaloApp: ZaloAppField) => {
        this._zaloApp = zaloApp;
    };

    main = async () => {
        if (!this._zaloApp) {
            console.error('Thiết lập thất bại !');
            return;
        }

        const accountId = this._zaloApp.accountId;
        const role = accountType_enum.MEMBER;

        const keyRedis = `${prefix_cache_zaloApp.key.with_accountId}_${accountId}_${role}`;
        const timeExpireat = prefix_cache_zaloApp.time;

        const zaloApp_redis = await this._serviceRedis.getData<ZaloAppField>(keyRedis);
        if (zaloApp_redis) {
            return;
        }

        const zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField = {
            role: role,
            accountId: this._zaloApp.accountId,
        };

        const queryDB = new QueryDB_GetZaloAppWithAccountId();
        queryDB.setZaloAppWithAccountIdBody(zaloAppWithAccountIdBody);

        const connection_pool = this._mssql_server.get_connectionPool();
        if (connection_pool) {
            queryDB.set_connection_pool(connection_pool);
        } else {
            console.error('Kết nối cơ sở dữ liệu không thành công !');
            return;
        }

        try {
            const result = await queryDB.run();
            if (result?.recordset.length && result?.recordset.length > 0) {
                const zaloApp: ZaloAppField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<ZaloAppField>(keyRedis, zaloApp, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloApp in Redis', keyRedis);
                }

                return zaloApp;
            } else {
                console.error('Lấy thông tin zaloApp KHÔNG thành công !');
                return;
            }
        } catch (error) {
            console.error('Lấy thông tin zaloApp KHÔNG thành công !!', error);
            return;
        }
    };
}

export default Handle_GetZaloAppWithAccountId;

import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';
import { accountType_enum } from '@src/dataStruct/account';
import { prefix_cache_zaloOa } from '@src/const/redisKey/zalo';
import QueryDB_GetZaloOaWithId from '../../qmdb/queryDB/GetZaloOaWithId';

class Handle_GetZaloOaWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _zaloOa: ZaloOaField | undefined;

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (zaloOa: ZaloOaField) => {
        this._zaloOa = zaloOa;
    };

    main = async () => {
        if (!this._zaloOa) {
            console.error('Thiết lập thất bại !');
            return;
        }

        const id = this._zaloOa.id;
        const role = accountType_enum.MEMBER;

        const keyRedis = `${prefix_cache_zaloOa.key.with_id}_${id}_${role}`;
        const timeExpireat = prefix_cache_zaloOa.time;

        const zaloOa_redis = await this._serviceRedis.getData<ZaloOaField>(keyRedis);
        if (zaloOa_redis) {
            return zaloOa_redis;
        }

        const zaloOaWithIdBody: ZaloOaWithIdBodyField = {
            id: id,
            accountId: this._zaloOa.accountId,
        };

        const queryDB = new QueryDB_GetZaloOaWithId();
        queryDB.setZaloOaWithIdBody(zaloOaWithIdBody);

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
                const zaloOa: ZaloOaField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<ZaloOaField>(keyRedis, zaloOa, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloOa in Redis', keyRedis);
                }

                return zaloOa;
            } else {
                console.error('Lấy thông tin zaloOa KHÔNG thành công !');
                return;
            }
        } catch (error) {
            console.error('Lấy thông tin zaloOa KHÔNG thành công !!', error);
            return;
        }
    };
}

export default Handle_GetZaloOaWithId;

import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZaloOaWithId from '../../queryDB/GetZaloOaWithId';
import { verifyRefreshToken } from '@src/token';
import { accountType_enum, accountType_type } from '@src/dataStruct/account';
import { prefix_cache_zaloOa } from '@src/const/redisKey/zalo';

class Handle_GetZaloOaWithId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    checkRole = (req: Request<any, any, ZaloOaWithIdBodyField>, res: Response, next: NextFunction) => {
        const zaloOaWithIdBody: ZaloOaWithIdBodyField = req.body;

        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloOaWithId-checkRole) !',
        };

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
            const accountId = zaloOaWithIdBody.accountId;
            if (id === accountId) {
                res.locals.role = accountType_enum.ADMIN;
            } else {
                res.locals.role = accountType_enum.MEMBER;
            }

            next();
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (req: Request<any, any, ZaloOaWithIdBodyField>, res: Response) => {
        const role: accountType_type = res.locals.role as accountType_type;
        const zaloOaWithIdBody: ZaloOaWithIdBodyField = req.body;
        const id = zaloOaWithIdBody.id;

        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-main) !',
        };

        const keyRedis = `${prefix_cache_zaloOa.key.with_id}_${id}_${role}`;
        const timeExpireat = prefix_cache_zaloOa.time;

        const zaloOa_redis = await this._serviceRedis.getData<ZaloOaField>(keyRedis);
        if (zaloOa_redis) {
            myResponse.data = zaloOa_redis;
            myResponse.message = 'Lấy thông tin zaloOa thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetZaloOaWithId();
        queryDB.setZaloOaWithIdBody(zaloOaWithIdBody);

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
                const zaloOa: ZaloOaField = { ...result?.recordset[0] };
                if (role === accountType_enum.MEMBER) {
                    zaloOa.oaId = 'Bạn không phải admin';
                    zaloOa.oaSecret = 'Bạn không phải admin';
                }

                const isSet = await this._serviceRedis.setData<ZaloOaField>(keyRedis, zaloOa, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloOa in Redis', keyRedis);
                }

                myResponse.data = zaloOa;
                myResponse.message = 'Lấy thông tin zaloOa thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloOa KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloOa KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZaloOaWithId;

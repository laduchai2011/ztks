import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField } from '@src/dataStruct/zalo/body';
import QueryDB_GetZaloAppWithAccountId from '../../queryDB/GetZaloAppWithAccountId';
import { verifyRefreshToken } from '@src/token';
import { accountType_enum, accountType_type } from '@src/dataStruct/account';
import { prefix_cache_zaloApp } from '@src/const/redisKey/zalo';

class Handle_GetZaloAppWithAccountId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    checkRole = (req: Request<any, any, ZaloAppWithAccountIdBodyField>, res: Response, next: NextFunction) => {
        const zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField = req.body;

        const myResponse: MyResponse<ZaloAppField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloAppWithAccountId (checkRole) !',
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
            const accountId = zaloAppWithAccountIdBody.accountId;
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

    main = async (req: Request<any, any, ZaloAppWithAccountIdBodyField>, res: Response) => {
        const role: accountType_type = res.locals.role as accountType_type;
        const zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField = req.body;
        const accountId = zaloAppWithAccountIdBody.accountId;

        const myResponse: MyResponse<ZaloAppField> = {
            isSuccess: false,
            message: 'Bắt đầu Handle_GetZaloAppWithAccountId (main) !',
        };

        const keyRedis = `${prefix_cache_zaloApp.key.with_accountId}_${accountId}_${role}`;
        const timeExpireat = prefix_cache_zaloApp.time;

        const zaloApp_redis = await this._serviceRedis.getData<ZaloAppField>(keyRedis);
        if (zaloApp_redis) {
            myResponse.data = zaloApp_redis;
            myResponse.message = 'Lấy thông tin zaloApp thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetZaloAppWithAccountId();
        queryDB.setZaloAppWithAccountIdBody(zaloAppWithAccountIdBody);

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
                const zaloApp: ZaloAppField = { ...result?.recordset[0] };
                if (role === accountType_enum.MEMBER) {
                    zaloApp.appId = 'Bạn không phải admin';
                    zaloApp.appSecret = 'Bạn không phải admin';
                }

                const isSet = await this._serviceRedis.setData<ZaloAppField>(keyRedis, zaloApp, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloApp in Redis', keyRedis);
                }

                myResponse.data = zaloApp;
                myResponse.message = 'Lấy thông tin zaloApp thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công 1 !';
                res.status(204).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZaloAppWithAccountId;

import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField } from '@src/dataStruct/zalo/body';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import QueryDB_GetZaloUserInfor from '../../queryZalo/GetZaloUserInfor';
import { ZaloUserBodyField } from '@src/dataStruct/zalo/user/body';
import { prefix_cache_zaloUser } from '@src/const/redisKey/zalo';
import { accountType_enum } from '@src/dataStruct/account';
import { prefix_cache_zaloApp } from '@src/const/redisKey/zalo';
import QueryDB_GetZaloAppWithAccountId from '../../queryDB/GetZaloAppWithAccountId';

class Handle_GetZaloUserInfor {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    getZaloApp = async (req: Request<any, any, ZaloUserBodyField>, res: Response, next: NextFunction) => {
        const zaloUserBody = req.body;
        const zaloApp = zaloUserBody.zaloApp;
        const accountId = zaloApp.accountId;
        const role = accountType_enum.ADMIN;

        const myResponse: MyResponse<ZaloAppField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-getZaloApp) !',
        };

        const keyRedis = `${prefix_cache_zaloApp.key.with_accountId}_${accountId}_${role}`;
        const timeExpireat = prefix_cache_zaloApp.time;

        const zaloApp_redis = await this._serviceRedis.getData<ZaloAppField>(keyRedis);
        if (zaloApp_redis) {
            res.locals.zaloApp = zaloApp_redis;
            next();
            return;
        }

        const zaloAppWithAccountIdBody: ZaloAppWithAccountIdBodyField = {
            role: role,
            accountId: zaloApp.accountId,
        };

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

                const isSet = await this._serviceRedis.setData<ZaloAppField>(keyRedis, zaloApp, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloApp in Redis', keyRedis);
                }

                res.locals.zaloApp = zaloApp;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloApp KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (req: Request<any, any, ZaloUserBodyField>, res: Response) => {
        const zaloUserBody: ZaloUserBodyField = req.body;
        const zaloApp = res.locals.zaloApp as ZaloAppField;
        const userIdByApp = zaloUserBody.userIdByApp;

        const myResponse: MyResponse<ZaloUserField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloUserInfor-main) !',
        };

        const keyRedis = `${prefix_cache_zaloUser.key.with_zaloAppId_userIdByApp}_${zaloApp.id}_${userIdByApp}`;
        const timeExpireat = prefix_cache_zaloUser.time;

        const zaloUser_redis = await this._serviceRedis.getData<ZaloUserField>(keyRedis);
        if (zaloUser_redis) {
            myResponse.data = zaloUser_redis;
            myResponse.message = 'Lấy thông tin zaloUser thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetZaloUserInfor();
        queryDB.setZaloUserBody(zaloUserBody);

        try {
            const result = await queryDB.run();

            if (result) {
                const isSet = await this._serviceRedis.setData<ZaloUserField>(keyRedis, result, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloUser in Redis', keyRedis);
                }

                myResponse.data = result;
                myResponse.message = 'Lấy thông tin zaloUserInfor thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin zaloUserInfor KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin zaloUserInfor KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetZaloUserInfor;

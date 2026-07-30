import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { verifyRefreshToken } from '@src/token';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { CallAgentField } from '@src/dataStruct/callAgent';
import { GetCallAgentWithAccountIdBodyField } from '@src/dataStruct/callAgent/body';
import QueryDB_GetCallAgentWithAccountId from '../../queryDB/GetCallAgentWithAccountId';
import { CacheGetCallAgentWithAccountId } from '@src/const/redisKey/callAgent';
import { getRefreshToken } from '@src/device/getDevice';

class Handle_GetCallAgentWithAccountId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _cacheGetCallAgentWithAccountId = new CacheGetCallAgentWithAccountId();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
        this._cacheGetCallAgentWithAccountId.init();
    }

    setup = async (req: Request<any, any, GetCallAgentWithAccountIdBodyField>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<CallAgentField> = {
            isSuccess: false,
            message: 'Băt đầu (Handle_GetCallAgentWithAccountId-setup) !',
        };

        const getCallAgentWithAccountIdBody = req.body;
        // const { refreshToken } = req.cookies;
        const refreshToken = getRefreshToken(req);

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
            getCallAgentWithAccountIdBody.accountId = id;
            res.locals.getCallAgentWithAccountIdBody = getCallAgentWithAccountIdBody;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    main = async (_: Request, res: Response) => {
        const getCallAgentWithAccountIdBody = res.locals
            .getCallAgentWithAccountIdBody as GetCallAgentWithAccountIdBodyField;

        this._cacheGetCallAgentWithAccountId.setBody(getCallAgentWithAccountIdBody);

        const myResponse: MyResponse<CallAgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetCallAgentWithAccountId-main)',
        };

        const callAgent_cache = await this._cacheGetCallAgentWithAccountId.getData();
        if (callAgent_cache) {
            myResponse.data = callAgent_cache;
            myResponse.message = 'Lấy thông tin callAgent thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        }

        const queryDB = new QueryDB_GetCallAgentWithAccountId();
        queryDB.setGetCallAgentWithAccountIdBody(getCallAgentWithAccountIdBody);

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
                const rData = result.recordset[0];

                this._cacheGetCallAgentWithAccountId.setData(rData);

                myResponse.data = rData;
                myResponse.message = 'Lấy thông tin callAgent thành công !';
                myResponse.isSuccess = true;
                res.status(200).json(myResponse);
                return;
            } else {
                myResponse.message = 'Lấy thông tin callAgent KHÔNG thành công !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin callAgent KHÔNG thành công !!';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };
}

export default Handle_GetCallAgentWithAccountId;

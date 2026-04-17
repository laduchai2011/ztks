import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Request, Response, NextFunction } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { verifyRefreshToken } from '@src/token';
import { sendMessageToUser } from '@src/services/message_v1/sendMessageToUser';
import { AgentField } from '@src/dataStruct/agent';
import { GetAgentWithAgentAccountIdBodyField } from '@src/dataStruct/agent/body';
import { MessageAmountInDayField } from '@src/dataStruct/message_v1';
import { CreateMessageV1BodyField } from '@src/dataStruct/message_v1/body';
import { ZaloOaField, ZaloAppField } from '@src/dataStruct/zalo';
import { ZaloAppWithAccountIdBodyField, ZaloOaWithIdBodyField } from '@src/dataStruct/zalo/body';
import { ResultSendToZaloField } from '@src/dataStruct/zalo/hookData';
import { accountType_enum } from '@src/dataStruct/account';
import { prefix_cache_zaloApp, prefix_cache_zaloOa } from '@src/const/redisKey/zalo';
import { prefix_cache_agent } from '@src/const/redisKey/agent';
import QueryDB_GetZaloAppWithAccountId from '../../queryDB/GetZaloAppWithAccountId';
import QueryDB_GetZaloOaWithId from '../../queryDB/GetZaloOaWithId';
import QueryDB_GetAgentWithAgentAccountId from '../../queryDB/GetAgentWithAgentAccountId';
import { getMessageAmountInDay } from '../../queryMongo/GetMessageAmountInDay';

class Handle_CreateMessageV1 {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (req: Request<Record<string, never>, unknown, any>, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<ResultSendToZaloField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetChatRoomRoleWithCridAaid-setup)',
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

            res.locals.myId = id;
            next();
            return;
        } else {
            myResponse.message = 'Vui lòng đăng nhập lại !';
            res.status(500).json(myResponse);
            return;
        }
    };

    getZaloApp = async (
        req: Request<Record<string, never>, unknown, CreateMessageV1BodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const createMessageV1Body = req.body;
        const zaloApp = createMessageV1Body.zaloApp;
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

    getZaloOa = async (
        req: Request<Record<string, never>, unknown, CreateMessageV1BodyField>,
        res: Response,
        next: NextFunction
    ) => {
        const createMessageV1Body = req.body;
        const zaloOa = createMessageV1Body.zaloOa;
        const id = zaloOa.id;
        const role = accountType_enum.ADMIN;

        const myResponse: MyResponse<ZaloOaField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-getZaloOa) !',
        };

        const keyRedis = `${prefix_cache_zaloOa.key.with_id}_${id}_${role}`;
        const timeExpireat = prefix_cache_zaloOa.time;

        const zaloOa_redis = await this._serviceRedis.getData<ZaloOaField>(keyRedis);
        if (zaloOa_redis) {
            res.locals.zaloOa = zaloOa_redis;
            next();
            return;
        }

        const zaloOaWithIdBody: ZaloOaWithIdBodyField = {
            id: id,
            accountId: zaloOa.accountId,
        };

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

                const isSet = await this._serviceRedis.setData<ZaloOaField>(keyRedis, zaloOa, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set zaloOa in Redis', keyRedis);
                }

                res.locals.zaloOa = zaloOa;
                next();
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

    getAgent = async (_: Request, res: Response, next: NextFunction) => {
        const myId = res.locals.myId as number;

        const myResponse: MyResponse<AgentField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_GetZaloAppWithAccountId-getAgent) !',
        };

        const getAgentWithAgentAccountIdBody: GetAgentWithAgentAccountIdBodyField = {
            agentAccountId: myId,
        };

        const keyRedis = `${prefix_cache_agent.key.with_agentAccountId}_${getAgentWithAgentAccountIdBody.agentAccountId}`;
        const timeExpireat = prefix_cache_agent.time;

        const agent_redis = await this._serviceRedis.getData<AgentField>(keyRedis);
        if (agent_redis) {
            res.locals.agent = agent_redis;
            next();
            return;
        }

        const queryDB = new QueryDB_GetAgentWithAgentAccountId();
        queryDB.setGetAgentWithAgentAccountIdBody(getAgentWithAgentAccountIdBody);

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
                const agent: AgentField = { ...result?.recordset[0] };

                const isSet = await this._serviceRedis.setData<AgentField>(keyRedis, agent, timeExpireat);
                if (!isSet) {
                    console.error('Failed to set agent in Redis', keyRedis);
                }

                res.locals.agent = agent;
                next();
                return;
            } else {
                myResponse.message = 'Lấy thông tin Agent KHÔNG thành công 1 !';
                res.status(200).json(myResponse);
                return;
            }
        } catch (error) {
            myResponse.message = 'Lấy thông tin Agent KHÔNG thành công 2 !';
            myResponse.err = error;
            res.status(500).json(myResponse);
            return;
        }
    };

    checkLimitMessage = async (_: Request, res: Response, next: NextFunction) => {
        const myId = res.locals.myId as number;
        const agent = res.locals.agent as AgentField;
        const type = agent.type;

        const myResponse: MyResponse<MessageAmountInDayField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateMessageV1-checkLimitMessage) !',
        };

        if (type !== 'basic') {
            next();
            return;
        }

        const data: MessageAmountInDayField | undefined = await getMessageAmountInDay(myId);
        if (!data) {
            myResponse.message = 'Lấy thông tin số lượng tin nhắn không thành công !';
            // res.status(200).json(myResponse);
            next();
            return;
        }

        const messageAmount = data.amount;
        if (messageAmount < 30) {
            next();
            return;
        }

        myResponse.message = 'Gói cơ bản của bạn đã hết hạn mức, vui lòng nâng cấp !';
        res.status(200).json(myResponse);
        return;
    };

    main = async (req: Request<Record<string, never>, unknown, CreateMessageV1BodyField>, res: Response) => {
        const createMessageV1Body = req.body;
        const zaloApp = res.locals.zaloApp as ZaloAppField;
        const zaloOa = res.locals.zaloOa as ZaloOaField;
        const payload = createMessageV1Body.payload;
        const myId = res.locals.myId as number;

        const myResponse: MyResponse<ResultSendToZaloField> = {
            isSuccess: false,
            message: 'Bắt đầu (Handle_CreateMessageV1-main)',
        };

        const result = await sendMessageToUser(zaloApp, zaloOa, payload);

        if (result?.message === 'Success') {
            const keyRedis = `replyAccountId_with_message_id_${result.data.message_id}`;
            const timeExpireat = 30;
            const isSet = await this._serviceRedis.setData<number>(keyRedis, myId, timeExpireat);
            if (!isSet) {
                console.error('Failed to set replyAccountId_with_message_id in Redis', keyRedis);
            }
            myResponse.data = result;
            myResponse.message = 'Gửi tin thành công !';
            myResponse.isSuccess = true;
            res.status(200).json(myResponse);
            return;
        } else {
            myResponse.message = 'Gửi tin không thành công !';
            res.status(200).json(myResponse);
            return;
        }
    };
}

export default Handle_CreateMessageV1;

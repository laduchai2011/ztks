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
import QueryDB_GetZaloAppWithAccountId from '../queryDB/GetZaloAppWithAccountId';
import QueryDB_GetZaloOaWithId from '../queryDB/GetZaloOaWithId';
import QueryDB_GetAgentWithAgentAccountId from '../../qmdb/queryDB/GetAgentWithAgentAccountId';
import { getMessageAmountInDay } from '../queryMongo/GetMessageAmountInDay';

class Handle_GetAgentWithAgentAccountId {
    private _mssql_server = mssql_server;
    private _serviceRedis = ServiceRedis.getInstance();
    private _agent: AgentField | undefined;

    constructor() {
        this._mssql_server.init();
        this._serviceRedis.init();
    }

    setup = (agent: AgentField) => {
        this._agent = agent;
    };

    main = async () => {
        if (!this._agent) {
            console.error('Thiết lập thất bại !');
            return;
        }

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
}

export default Handle_GetAgentWithAgentAccountId;

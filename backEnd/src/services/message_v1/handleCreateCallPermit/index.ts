import { mssql_server } from '@src/connect';
import { CallAgentField, CallPerMitField } from '@src/dataStruct/callAgent';
import {
    GetCallAgentWithAccountIdBodyField,
    CreateCallPermitBodyField,
    GetCallPermitWithUidBodyField,
} from '@src/dataStruct/callAgent/body';
import QueryDB_GetCallAgentWithAccountId from '../handleHookData/queryDB/GetCallAgent';
import QueryDB_GetCallPermitWithUid from '../handleHookData/queryDB/GetCallPermit';
import MutateDB_CreateCallPermit from '../handleHookData/mutateDB/CreateCallPermit';
import { CacheGetCallAgentWithAccountId, CacheGetCallPermitWithUid } from '@src/const/redisKey/callAgent';
import { my_log } from '@src/log';

async function getCallAgentWithAccountId(accountId: number) {
    const getCallAgentWithAccountIdBody: GetCallAgentWithAccountIdBodyField = {
        accountId: accountId,
    };

    const cacheGetCallAgentWithAccountId = new CacheGetCallAgentWithAccountId({
        logPrameter: 'getCallAgentWithAccountId in hookData',
    });
    await cacheGetCallAgentWithAccountId.init();
    cacheGetCallAgentWithAccountId.setBody(getCallAgentWithAccountIdBody);

    const callAgent_cache = await cacheGetCallAgentWithAccountId.getData();
    if (callAgent_cache) {
        return callAgent_cache;
    }

    const queryDB = new QueryDB_GetCallAgentWithAccountId();
    queryDB.setGetCallAgentWithAccountIdBody(getCallAgentWithAccountIdBody);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        queryDB.set_connection_pool(connection_pool);
    } else {
        my_log.withYellow('Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await queryDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            const callAgent: CallAgentField = result?.recordset[0];
            cacheGetCallAgentWithAccountId.setData(callAgent);
            return callAgent;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function getCallPermitWithUid(uid: string) {
    const getCallPermitWithUidBody: GetCallPermitWithUidBodyField = {
        uid: uid,
    };

    const cacheGetCallPermitWithUid = new CacheGetCallPermitWithUid({
        logPrameter: 'getCallPermitWithUid in hookData',
    });
    await cacheGetCallPermitWithUid.init();
    cacheGetCallPermitWithUid.setBody(getCallPermitWithUidBody);

    const callPermit_cache = await cacheGetCallPermitWithUid.getData();
    if (callPermit_cache) {
        return callPermit_cache;
    }

    const queryDB = new QueryDB_GetCallPermitWithUid();
    queryDB.setGetCallPermitWithUidBody(getCallPermitWithUidBody);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        queryDB.set_connection_pool(connection_pool);
    } else {
        my_log.withYellow('Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await queryDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            const callPermit: CallPerMitField = result?.recordset[0];
            cacheGetCallPermitWithUid.setData(callPermit);
            return callPermit;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function createCallPermit(uid: string, appId: string, oaId: string, callAgentId: number, accountId: number) {
    const createCallPermitRoomBody: CreateCallPermitBodyField = {
        uid: uid,
        appId: appId,
        oaId: oaId,
        callAgentId: callAgentId,
        accountId: accountId,
    };

    const mutateDB = new MutateDB_CreateCallPermit();
    mutateDB.setCreateCallPermitBody(createCallPermitRoomBody);

    const connection_pool = mssql_server.get_connectionPool();
    if (connection_pool) {
        mutateDB.set_connection_pool(connection_pool);
    } else {
        my_log.withYellow('Kết nối cơ sở dữ liệu không thành công !');
        return;
    }

    try {
        const result = await mutateDB.run();
        if (result?.recordset.length && result?.recordset.length > 0) {
            const callPerMit: CallPerMitField = result?.recordset[0];

            return callPerMit;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function handleCreateCallPermit(uid: string, appId: string, oaId: string, accountId: number) {
    const callPermit = await getCallPermitWithUid(uid);
    if (callPermit) return;

    const callAgent = await getCallAgentWithAccountId(accountId);
    if (!callAgent) {
        console.warn(`Không thấy callAgent của ${accountId} !`);
        return;
    }

    const newCallPermit = await createCallPermit(uid, appId, oaId, callAgent.id, accountId);
    if (!newCallPermit) {
        console.warn(`Tạo callPermit cho ${uid} không thành công !`);
        return;
    }
}

export default handleCreateCallPermit;

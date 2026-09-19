import { Call_Agent_Field, Call_PerMit_Field } from '@src/data_struct/call_agent';
import {
    Get_Call_Agent_With_Account_Id_Body_Field,
    Create_Call_Permit_Body_Field,
    Get_Call_Permit_With_Uid_Body_Field,
} from '@src/data_struct/call_agent/body';
import QueryDB_Get_Call_Agent_With_Account_Id from '../handleHookData/queryDB/Get_Call_Agent';
import QueryDB_Get_Call_Permit_With_Uid from '../handleHookData/queryDB/Get_Call_Permit';
import MutateDB_Create_Call_Permit from '../handleHookData/mutateDB/Create_Call_Permit';
import { Cache_Get_Call_Agent_With_Account_Id, Cache_Get_Call_Permit_With_Uid } from '@src/const/redisKey/call_agent';
import { my_log } from '@src/log';

async function get_Call_Agent_With_Account_Id(account_id: string) {
    const get_call_agent_with_account_id_body: Get_Call_Agent_With_Account_Id_Body_Field = {
        account_id: account_id,
    };

    const cache_get_call_agent_with_account_id = new Cache_Get_Call_Agent_With_Account_Id({
        log_prameter: 'get_Call_Agent_With_Account_Id in hook_data',
    });
    await cache_get_call_agent_with_account_id.init();
    cache_get_call_agent_with_account_id.set_Body(get_call_agent_with_account_id_body);

    const call_agent_cache = await cache_get_call_agent_with_account_id.get_Data();
    if (call_agent_cache) {
        return call_agent_cache;
    }

    const queryDB = new QueryDB_Get_Call_Agent_With_Account_Id();
    queryDB.set_Get_Call_Agent_With_Account_Id_Body(get_call_agent_with_account_id_body);

    try {
        const result = await queryDB.run();
        if (result) {
            cache_get_call_agent_with_account_id.set_Data(result);
            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function get_Call_Permit_With_Uid(uid: string) {
    const get_call_permit_with_uid_body: Get_Call_Permit_With_Uid_Body_Field = {
        uid: uid,
    };

    const cache_get_call_permit_with_uid = new Cache_Get_Call_Permit_With_Uid({
        log_prameter: 'get_Call_Permit_With_Uid in hook_data',
    });
    await cache_get_call_permit_with_uid.init();
    cache_get_call_permit_with_uid.set_Body(get_call_permit_with_uid_body);

    const call_permit_cache = await cache_get_call_permit_with_uid.get_Data();
    if (call_permit_cache) {
        return call_permit_cache;
    }

    const queryDB = new QueryDB_Get_Call_Permit_With_Uid();
    queryDB.set_Get_Call_Permit_With_Uid_Body(get_call_permit_with_uid_body);

    try {
        const result = await queryDB.run();
        if (result) {
            cache_get_call_permit_with_uid.set_Data(result);
            return result;
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

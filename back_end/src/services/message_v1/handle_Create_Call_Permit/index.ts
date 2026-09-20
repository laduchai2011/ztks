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

async function create_Call_Permit(
    uid: string,
    app_id: string,
    oa_id: string,
    call_agent_id: string,
    account_id: string
) {
    const create_call_permit_room_body: Create_Call_Permit_Body_Field = {
        uid: uid,
        app_id: app_id,
        oa_id: oa_id,
        call_agent_id: call_agent_id,
        account_id: account_id,
    };

    const mutateDB = new MutateDB_Create_Call_Permit();
    mutateDB.set_Create_Call_Permit_Body(create_call_permit_room_body);

    try {
        const result = await mutateDB.run();
        if (result) {
            return result;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function handle_Create_Call_Permit(uid: string, app_id: string, oa_id: string, account_id: string) {
    const call_permit = await get_Call_Permit_With_Uid(uid);
    if (call_permit) return;

    const call_agent = await get_Call_Agent_With_Account_Id(account_id);
    if (!call_agent) {
        console.warn(`Không thấy call_agent của ${account_id} !`);
        return;
    }

    const new_call_permit = await create_Call_Permit(uid, app_id, oa_id, call_agent.id, account_id);
    if (!new_call_permit) {
        console.warn(`Tạo call_permit cho ${uid} không thành công !`);
        return;
    }
}

export default handle_Create_Call_Permit;

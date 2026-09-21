import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CALL_AGENT_API = {
    GET_CALL_AGENT_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service__call_agent/query/get_call_agent_with_account_id`,
    CREATE_ZALO_TRUNK: `${BASE_URL}${apiString}/service__call_agent/mutate/create_zalo_trunk`,
};

import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CALL_AGENT_API = {
    GET_CALL_AGENT_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service_callAgent/query/getCallAgentWithAccountId`,
    CREATE_ZALO_TRUNK: `${BASE_URL}${apiString}/service_callAgent/mutate/createZaloTrunk`,
};

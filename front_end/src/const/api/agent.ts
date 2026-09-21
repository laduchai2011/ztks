import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const AGENT_API = {
    GET_AGENT_WITH_ID: `${BASE_URL}${apiString}/service__agent/query/get_agent_with_id`,
    GET_AGENT_WITH_AGENT_ACCOUNT_ID: `${BASE_URL}${apiString}/service__agent/query/get_agent_with_agent_account_id`,
    GET_AGENTS: `${BASE_URL}${apiString}/service__agent/query/get_agents`,
    CREATE_AGENT: `${BASE_URL}${apiString}/service__agent/mutate/create_agent`,
    AGENT_ADD_ACCOUNT: `${BASE_URL}${apiString}/service__agent/mutate/agent_add_account`,
    AGENT_DEL_ACCOUNT: `${BASE_URL}${apiString}/service__agent/mutate/agent_del_account`,
    GET_LAST_AGENT_PAY: `${BASE_URL}${apiString}/service__agent/query/get_last_agent_pay`,
    CREATE_AGENT_PAY: `${BASE_URL}${apiString}/service__agent/mutate/create_agent_pay`,
};

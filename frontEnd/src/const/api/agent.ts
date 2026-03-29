import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const AGENT_API = {
    GET_AGENT_WITH_ID: `${BASE_URL}${apiString}/service_agent/query/getAgentWithId`,
    GET_AGENTS: `${BASE_URL}${apiString}/service_agent/query/getAgents`,
    CREATE_AGENT: `${BASE_URL}${apiString}/service_agent/mutate/createAgent`,
    AGENT_ADD_ACCOUNT: `${BASE_URL}${apiString}/service_agent/mutate/agentAddAccount`,
    AGENT_DEL_ACCOUNT: `${BASE_URL}${apiString}/service_agent/mutate/agentDelAccount`,
    GET_LAST_AGENT_PAY: `${BASE_URL}${apiString}/service_agent/query/getLastAgentPay`,
    CREATE_AGENT_PAY: `${BASE_URL}${apiString}/service_agent/mutate/createAgentPay`,
};

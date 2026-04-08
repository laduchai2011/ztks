import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHAT_SESSION_API = {
    GET_CHAT_SESSION_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service_chatSession/query/getChatSessionsWithAccountId`,
    CREATE_CHAT_SESSION: `${BASE_URL}${apiString}/service_chatSession/mutate/createChatSession`,
    UPDATE_SELECTED_ACCOUNT_ID: `${BASE_URL}${apiString}/service_chatSession/mutate/updateSelectedAccountIdOfChatSession`,
    UPDATE_ISREADY_ID: `${BASE_URL}${apiString}/service_chatSession/mutate/updateIsReadyOfChatSession`,
};

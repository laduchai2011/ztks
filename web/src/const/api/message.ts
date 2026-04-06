import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const MESSAGE_API = {
    GET_MESSAGES: `${BASE_URL}${apiString}/service_message/query/getMessages`,
    GET_MESSAGES_HAS_FILTER: `${BASE_URL}${apiString}/service_message/query/getMessagesHasFilter`,
    CREATE_MESSAGE: `${BASE_URL}${apiString}/service_message/mutate/createMessage`,
    UPDATE_MESSAGE_STATUS: `${BASE_URL}${apiString}/service_message/mutate/updateMessageStatus`,
};

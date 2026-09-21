import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHAT_SESSION_API = {
    GET_CHAT_SESSION_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service__chat_session/query/get_chat_sessions_with_account_id`,
    CREATE_CHAT_SESSION: `${BASE_URL}${apiString}/service__chat_session/mutate/create_chat_session`,
    UPDATE_SELECTED_ACCOUNT_ID: `${BASE_URL}${apiString}/service__chat_session/mutate/update_selected_account_id_of_chat_session`,
    UPDATE_ISREADY_ID: `${BASE_URL}${apiString}/service__chat_session/mutate/update_is_ready_of_chat_session`,
    LEAVE_ALL_CHAT_SESSION: `${BASE_URL}${apiString}/service__chat_session/mutate/leave_all_chat_session`,
};

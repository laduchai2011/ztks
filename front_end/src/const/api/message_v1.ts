import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const MESSAGE_V1_API = {
    GET_MESSAGES_FOR_CHAT_SCREEN: `${BASE_URL}${apiString}/service__message_v1/query/get_messages_for_chat_screen`,
    GET_LAST_MESSAGE: `${BASE_URL}${apiString}/service__message_v1/query/get_last_message`,
    GET_LAST_MESSAGE_WITH_UID: `${BASE_URL}${apiString}/service__message_v1/query/get_last_message_with_uid`,
    GET_MESSAGE_WITH_ID: `${BASE_URL}${apiString}/service__message_v1/query/get_message_with_id`,
    GET_MESSAGE_WITH_MSG_ID: `${BASE_URL}${apiString}/service__message_v1/query/get_message_with_msg_id`,
    CREATE_MESSAGEV1: `${BASE_URL}${apiString}/service__message_v1/mutate/create_message_v1`,
    GET_ALL_NEW_MESSAGE: `${BASE_URL}${apiString}/service__message_v1/query/get_all_new_messages`,
    DEL_ALL_NEW_MESSAGE: `${BASE_URL}${apiString}/service__message_v1/mutate/del_all_new_messages`,
    VIDEO_MESSAGE: `${BASE_URL}${apiString}/service__message_v1/mutate/video_message`,
};

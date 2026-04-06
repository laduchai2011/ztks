import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHAT_ROOM_API = {
    GET_CHAT_ROOM_WITH_ID: `${BASE_URL}${apiString}/service_chatRoom/query/getChatRoomWithId`,
    GET_CHAT_ROOM_ROLE_WITH_CRID_AAID: `${BASE_URL}${apiString}/service_chatRoom/query/getChatRoomRoleWithCridAaid`,
    UPDATE_SETUP_CHAT_ROOM_ROLE: `${BASE_URL}${apiString}/service_chatRoom/mutate/updateSetupChatRoomRole`,
    CREATE_CHAT_ROOM_ROLE: `${BASE_URL}${apiString}/service_chatRoom/mutate/createChatRoomRole`,
    GET_CHAT_ROOMS_MONGO: `${BASE_URL}${apiString}/service_chatRoom/query/getChatRoomsMongo`,
};

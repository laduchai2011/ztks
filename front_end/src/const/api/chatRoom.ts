import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHAT_ROOM_API = {
    GET_MY_CHAT_ROOMS: `${BASE_URL}${apiString}/service__chat_room/query/get_my_chat_rooms`,
    GET_CHAT_ROOM_WITH_ID: `${BASE_URL}${apiString}/service__chat_room/query/get_chat_room_with_id`,
    GET_CHAT_ROOM_ROLE_WITH_CRID_AAID: `${BASE_URL}${apiString}/service__chat_room/query/get_chat_room_role_with_crid_aaid`,
    UPDATE_SETUP_CHAT_ROOM_ROLE: `${BASE_URL}${apiString}/service__chat_room/mutate/update_setup_chat_room_role`,
    CREATE_CHAT_ROOM_ROLE: `${BASE_URL}${apiString}/service__chat_room/mutate/create_chat_room_role`,
    GET_CHAT_ROOMS_MONGO: `${BASE_URL}${apiString}/service__chat_room/query/get_chat_rooms_mongo`,
    CHANGE_CHAT_ROOM_MASTER: `${BASE_URL}${apiString}/service__chat_room/mutate/change_chat_room_master`,
    CREATE_CHAT_ROOM_PHONE: `${BASE_URL}${apiString}/service__chat_room/mutate/create_chat_room_phone`,
    GET_LATEST_CHAT_ROOM_PHONE: `${BASE_URL}${apiString}/service__chat_room/query/get_latest_chat_room_phone`,
    GET_LIST_CHAT_ROOM_PHONES: `${BASE_URL}${apiString}/service__chat_room/query/get_list_chat_room_phones`,
};

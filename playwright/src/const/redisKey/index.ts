import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const redisKey_memberReceiveMessage = isProduct
    ? 'redisKey_memberReceiveMessage'
    : 'redisKey_memberReceiveMessage_dev';

export const prefix_cache_zaloApp_with_appId = isProduct
    ? 'prefix_cache_zaloApp_with_appId'
    : 'prefix_cache_zaloApp_with_appId_dev';

export const prefix_cache_zaloOa_list_with_zaloAppId = isProduct
    ? 'prefix_cache_zaloOa_list_with_zaloAppId'
    : 'prefix_cache_zaloOa_list_with_zaloAppId_dev';

export const prefix_cache_chatRoom_with_zaloOaId_userIdByApp = isProduct
    ? 'prefix_cache_chatRoom_with_zaloOaId_userIdByApp'
    : 'prefix_cache_chatRoom_with_zaloOaId_userIdByApp_dev';

export const prefix_cache_zalo_accessToken_with_zaloOaId = isProduct
    ? 'prefix_cache_zalo_accessToken_with_zaloOaId'
    : 'prefix_cache_zalo_accessToken_with_zaloOaId_dev';

export const prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp = isProduct
    ? 'prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp'
    : 'prefix_cache_zalo_message_wait_session_with_zaloOaId_userIdByApp_dev';

import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const redisKey_memberReceiveMessage = isProduct
    ? 'redisKey_memberReceiveMessage'
    : 'redisKey_memberReceiveMessage_dev';

export const prefix_cache__zalo_app_with_app_id = isProduct
    ? 'prefix_cache__zalo_app_with_app_id'
    : 'prefix_cache__zalo_app_with_app_id_dev';

export const prefix_cache__zalo_oa_list_with_zalo_app_id = isProduct
    ? 'prefix_cache__zalo_oa_list_with_zalo_app_id'
    : 'prefix_cache__zalo_oa_list_with_zalo_app_id_dev';

export const prefix_cache__zalo_access_token_with_zalo_oa_id = isProduct
    ? 'prefix_cache__zalo_access_token_with_zalo_oa_id'
    : 'prefix_cache__zalo_access_token_with_zalo_oa_id_dev';

export const prefix_cache__zalo_message_wait_session_with_zalo_oa_id_user_id_by_app = isProduct
    ? 'prefix_cache__zalo_message_wait_session_with_zalo_oa_id_user_id_by_app'
    : 'prefix_cache__zalo_message_wait_session_with_zalo_oa_id_user_id_by_app_dev';

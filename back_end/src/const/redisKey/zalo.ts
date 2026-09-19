import dotenv from 'dotenv';
import { account_type_enum } from '@src/data_struct/account';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

// export const prefix_cache_zaloUserInfor_with_zaloOaId_userIdByApp = isProduct
//     ? 'prefix_cache_zaloUserInfor_with_zaloOaId_userIdByApp'
//     : 'prefix_cache_zaloUserInfor_with_zaloOaId_userIdByApp_dev';

// export const prefix_cache_zaloUserInfor_key = {
//     with_zaloOaId_userIdByApp: isProduct
//         ? 'prefix_cache_zaloUserInfor_with_zaloOaId_userIdByApp'
//         : 'prefix_cache_zaloUserInfor_with_zaloOaId_userIdByApp_dev',
// };

export const prefix_cache__zalo_user = {
    key: {
        with_zalo_app_id_user_id_by_app: isProduct
            ? 'prefix_cache__zalo_user_with_zalo_app_id_user_id_by_app'
            : 'prefix_cache__zalo_user_with_zalo_app_id_user_id_by_app_dev',
    },
    time: 60 * 1, // 5p
};

export const prefix_cache__zalo_oa = {
    key: {
        with_id: isProduct ? 'prefix_cache__zalo_oa_with_id' : 'prefix_cache__zalo_oa_with_id_dev',
        with_account_id: isProduct
            ? 'prefix_cache__zalo_oa_with_account_id'
            : 'prefix_cache__zalo_oa_with_account_id_dev',
    },
    time: 60 * 5, // 5p
};

export const prefix_cache__zalo_app = {
    key: {
        with_account_id: isProduct
            ? 'prefix_cache__zalo_app_with_account_id'
            : 'prefix_cache__zalo_app_with_account_id_dev',
        // with_zaloOaId: isProduct ? 'prefix_cache_zaloApp_with_zaloOaId' : 'prefix_cache_zaloApp_with_zaloOaId_dev',
    },
    roles: [account_type_enum.ADMIN, account_type_enum.MEMBER],
    time: 60 * 5, // 5p
};

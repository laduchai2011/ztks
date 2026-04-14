import dotenv from 'dotenv';
import { accountType_enum } from '@src/dataStruct/account';

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

export const prefix_cache_zaloUser = {
    key: {
        with_zaloAppId_userIdByApp: isProduct
            ? 'prefix_cache_zaloOa_with_zaloAppId_userIdByApp'
            : 'prefix_cache_zaloOa_with_zaloAppId_userIdByApp_dev',
    },
    time: 60 * 1, // 5p
};

export const prefix_cache_zaloOa = {
    key: {
        with_id: isProduct ? 'prefix_cache_zaloOa_with_id' : 'prefix_cache_zaloOa_with_id_dev',
    },
    roles: [accountType_enum.ADMIN, accountType_enum.MEMBER],
    time: 60 * 1, // 5p
};

export const prefix_cache_zaloApp = {
    key: {
        with_accountId: isProduct ? 'prefix_cache_zaloApp_with_accountId' : 'prefix_cache_zaloApp_with_accountId_dev',
        // with_zaloOaId: isProduct ? 'prefix_cache_zaloApp_with_zaloOaId' : 'prefix_cache_zaloApp_with_zaloOaId_dev',
    },
    roles: [accountType_enum.ADMIN, accountType_enum.MEMBER],
    time: 60 * 1, // 5p
};

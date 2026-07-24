import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache_callAgent = {
    key: {
        with_accountId: isProduct
            ? 'prefix_cache_callAgent_with_accountId'
            : 'prefix_cache_callAgent_with_accountId_dev',
    },
    time: 60 * 5, // 5p
};

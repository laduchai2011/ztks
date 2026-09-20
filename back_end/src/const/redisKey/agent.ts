import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache__agent = {
    key: {
        with_agent_account_id: isProduct
            ? 'prefix_cache__agent_with_agent_account_id'
            : 'prefix_cache__agent_with_agent_account_id_dev',
    },
    time: 60 * 5, // 5p
};

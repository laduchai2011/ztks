import dotenv from 'dotenv';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

export const prefix_cache_agent = {
    key: {
        with_agentAccountId: isProduct
            ? 'prefix_cache_agent_with_agentAccountId'
            : 'prefix_cache_agent_with_agentAccountId_dev',
    },
    time: 60 * 5, // 5p
};

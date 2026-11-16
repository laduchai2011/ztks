import { Client } from '@elastic/elasticsearch';
import { elastic_config } from '@src/config';

const elasticClient = new Client({
    node: `https://${elastic_config?.host}:${elastic_config?.port}`,

    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || '',
    },

    requestTimeout: 30000,
    maxRetries: 3,
});

export default elasticClient;

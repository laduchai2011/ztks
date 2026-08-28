import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const STATISTICS_API = {
    GET_STATISTICS: `${BASE_URL}${apiString}/service_statistics/query/getStatistics`,
};

import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const STATISTICS_API = {
    GET_STATISTICS_OA: `${BASE_URL}${apiString}/service__statistics/query/get_statistics_oa`,
};

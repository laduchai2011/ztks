import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ZALO_API = {
    GET_ZALOOA_WITH_ID: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaWithId`,
};

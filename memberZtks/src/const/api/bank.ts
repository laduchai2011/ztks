import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const BANK_API = {
    GET_BANK_WITH_ID: `${BASE_URL}${apiString}/service_bank/query/getBankWithId`,
};

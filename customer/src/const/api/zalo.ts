import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ZALO_API = {
    GET_ZALOAPP_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service_zalo/query/getZaloAppWithAccountId`,
    GET_ZALOOA_LIST_WITH_2FK: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaListWith2Fk`,
    GET_ZALOOA_WITH_ID: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaWithId`,
    GET_ZALOUSER: `${BASE_URL}${apiString}/service_zalo/query/getZaloUserInfor`,
};

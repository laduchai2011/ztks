import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ZALO_API = {
    GET_ZALOAPP_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service_zalo/query/getZaloAppWithAccountId`,
    GET_ZALOOA_LIST_WITH_2FK: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaListWith2Fk`,
    GET_ZALOOA_WITH_ID: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaWithId`,
    GET_ZALOUSER: `${BASE_URL}${apiString}/service_zalo/query/getZaloUserInfor`,
    GEN_ZALO_OA_TOKEN: `${BASE_URL}${apiString}/service_zalo/mutate/genZaloOaToken`,
    GET_ZALO_OA_TOKEN_WITH_FK: `${BASE_URL}${apiString}/service_zalo/query/getZaloOaTokenWithFk`,
    CREATE_ZALO_OA_TOKEN: `${BASE_URL}${apiString}/service_zalo/mutate/createZaloOaToken`,
    UPDATE_REFRESH_TOKEN_OF_ZALO_OA: `${BASE_URL}${apiString}/service_zalo/mutate/updateRefreshTokenOfZaloOa`,
};

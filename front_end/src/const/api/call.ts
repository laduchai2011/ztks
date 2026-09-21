import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CALL_API = {
    GET_MCC_INFOR: `${BASE_URL}${apiString}/service__call/query/get_mcc_info`,
    CHECK_CONSENT: `${BASE_URL}${apiString}/service__call/query/check_consent`,
    REQUEST_CONSENT: `${BASE_URL}${apiString}/service__call/mutate/request_consent`,
    OUT_BOUND: `${BASE_URL}${apiString}/service__call/mutate/outbound`,
};

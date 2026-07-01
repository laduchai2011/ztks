import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CALL_API = {
    GET_MCC_INFOR: `${BASE_URL}${apiString}/service_call/query/getMccInfo`,
    CHECK_CONSENT: `${BASE_URL}${apiString}/service_call/query/checkConsent`,
    REQUEST_CONSENT: `${BASE_URL}${apiString}/service_call/mutate/requestConsent`,
    OUT_BOUND: `${BASE_URL}${apiString}/service_call/mutate/outbound`,
};

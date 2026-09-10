import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHECK_IN_OUT_API = {
    GET_MY_CHECK_IN_OUTS: `${BASE_URL}${apiString}/service_checkInOut/query/getMyCheckInOuts`,
    GET_CHECK_IN_OUTS_WITH_DATE: `${BASE_URL}${apiString}/service_checkInOut/query/getCheckInOutsWithDate`,
    CREATE_CHECK_IN_OUT: `${BASE_URL}${apiString}/service_checkInOut/mutate/createCheckInOut`,
    GET_CHECK_IN_OUT_INSPECT_WITH_FK: `${BASE_URL}${apiString}/service_checkInOut/query/getCheckInOutInspectWithFk`,
    CREATE_CHECK_IN_OUT_INSPECT: `${BASE_URL}${apiString}/service_checkInOut/mutate/createCheckInOutInspect`,
};

import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHECK_IN_OUT_API = {
    GET_MY_CHECK_IN_OUTS: `${BASE_URL}${apiString}/service__check_in_out/query/get_my_check_in_outs`,
    GET_CHECK_IN_OUTS_WITH_DATE: `${BASE_URL}${apiString}/service__check_in_out/query/get_check_in_outs_with_date`,
    CREATE_CHECK_IN_OUT: `${BASE_URL}${apiString}/service__check_in_out/mutate/create_check_in_out`,
    GET_CHECK_IN_OUT_INSPECT_WITH_FK: `${BASE_URL}${apiString}/service__check_in_out/query/get_check_in_out_inspect_with_fk`,
    CREATE_CHECK_IN_OUT_INSPECT: `${BASE_URL}${apiString}/service__check_in_out/mutate/create_check_in_out_inspect`,
};

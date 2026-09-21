import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const MYCUSTOMER_API = {
    GET_MY_CUSTOMERS: `${BASE_URL}${apiString}/service__my_customer/query/get_my_customers`,
    GET_IS_NEW_MESSAGE: `${BASE_URL}${apiString}/service__my_customer/query/get_a_is_new_message`,
    GET_INFOR_CUSTOMER_ON_ZALO: `${BASE_URL}${apiString}/service__my_customer/query/get_infor_customer_on_zalo`,
    Del_IS_NEW_MESSAGE: `${BASE_URL}${apiString}/service__my_customer/mutate/del_is_new_message`,
};

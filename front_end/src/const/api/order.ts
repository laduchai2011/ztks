import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ORDER_API = {
    GET_ORDERS: `${BASE_URL}${apiString}/service__order/query/get_orders`,
    GET_ORDER_WITH_ID: `${BASE_URL}${apiString}/service__order/query/get_order_with_id`,
    GET_ALL_ORDER_STATUS: `${BASE_URL}${apiString}/service__order/query/get_all_order_status`,
    CREATE_ORDER: `${BASE_URL}${apiString}/service__order/mutate/create_order`,
    UPDATE_ORDER: `${BASE_URL}${apiString}/service__order/mutate/update_order`,
    CREATE_ORDER_STATUS: `${BASE_URL}${apiString}/service__order/mutate/create_order_status`,
    ORDER_SELECT_VOUCHER: `${BASE_URL}${apiString}/service__order/mutate/order_select_voucher`,
};

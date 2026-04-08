import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ORDER_API = {
    GET_ORDERS: `${BASE_URL}${apiString}/service_order/query/getOrders`,
    GET_ORDER_WITH_ID: `${BASE_URL}${apiString}/service_order/query/getOrderWithId`,
    GET_ALL_ORDER_STATUS: `${BASE_URL}${apiString}/service_order/query/getAllOrderStatus`,
    CREATE_ORDER: `${BASE_URL}${apiString}/service_order/mutate/createOrder`,
    UPDATE_ORDER: `${BASE_URL}${apiString}/service_order/mutate/updateOrder`,
    CREATE_ORDER_STATUS: `${BASE_URL}${apiString}/service_order/mutate/createOrderStatus`,
};

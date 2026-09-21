import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VOUCHER_API = {
    GET_VOUCHERS: `${BASE_URL}${apiString}/service__voucher/query/get_vouchers`,
    GET_VOUCHER_WITH_ORDER_ID: `${BASE_URL}${apiString}/service__voucher/query/get_voucher_with_order_id`,
};

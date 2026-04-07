import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VOUCHER_API = {
    GET_VOUCHERS: `${BASE_URL}${apiString}/service_voucher/query/getVouchers`,
    GET_VOUCHER_WITH_ORDER_ID: `${BASE_URL}${apiString}/service_voucher/query/getVoucherWithOrderId`,
};

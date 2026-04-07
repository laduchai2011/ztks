import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VOUCHER_API = {
    CREATE_VOUCHER: `${BASE_URL}${apiString}/service_voucher/mutate/createVoucher`,
};

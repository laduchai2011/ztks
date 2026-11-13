import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const PRODUCT_API = {
    CREATE_PRODUCT_CODE: `${BASE_URL}${apiString}/service__product/mutate/create_product_code`,
};

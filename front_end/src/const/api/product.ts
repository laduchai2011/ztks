import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const PRODUCT_API = {
    GET_RANDOM_PRODUCTS: `${BASE_URL}${apiString}/service__product/query/get_random_products`,
    GET_PRODUCT_CODE_TOTAL: `${BASE_URL}${apiString}/service__product/query/get_product_code_total`,
    GET_PRODUCT_TOTAL: `${BASE_URL}${apiString}/service__product/query/get_product_total`,
    GET_PRODUCT_CODE_BY_ID: `${BASE_URL}${apiString}/service__product/query/get_product_code_by_id`,
    GET_PRODUCT_BY_ID: `${BASE_URL}${apiString}/service__product/query/get_product_by_id`,
    PRODUCT_CODE_SEARCH: `${BASE_URL}${apiString}/service__product/query/product_code_search`,
    PRODUCT_SEARCH: `${BASE_URL}${apiString}/service__product/query/product_search`,
    CREATE_PRODUCT_CODE: `${BASE_URL}${apiString}/service__product/mutate/create_product_code`,
    CREATE_PRODUCT: `${BASE_URL}${apiString}/service__product/mutate/create_product`,
};

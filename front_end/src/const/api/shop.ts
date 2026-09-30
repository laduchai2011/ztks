import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const SHOP_API = {
    GET_MY_SHOPS: `${BASE_URL}${apiString}/service__shop/query/get_my_shops`,
    GET_MY_DEPOTS: `${BASE_URL}${apiString}/service__shop/query/get_my_depots`,
    GET_MY_STORES: `${BASE_URL}${apiString}/service__shop/query/get_my_stores`,
    GET_LATEST_SHOP_PAY_WITH_SHOP_ID: `${BASE_URL}${apiString}/service__shop/query/get_latest_shop_pay_with_shop_id`,
    CREATE_SHOP: `${BASE_URL}${apiString}/service__shop/mutate/create_shop`,
    CREATE_DEPOT: `${BASE_URL}${apiString}/service__shop/mutate/create_depot`,
    CREATE_STORE: `${BASE_URL}${apiString}/service__shop/mutate/create_store`,
    EDIT_SHOP: `${BASE_URL}${apiString}/service__shop/mutate/edit_shop`,
    EDIT_DEPOT: `${BASE_URL}${apiString}/service__shop/mutate/edit_depot`,
    EDIT_STORE: `${BASE_URL}${apiString}/service__shop/mutate/edit_store`,
    DELETE_SHOP: `${BASE_URL}${apiString}/service__shop/mutate/delete_shop`,
    DELETE_DEPOT: `${BASE_URL}${apiString}/service__shop/mutate/delete_depot`,
    DELETE_STORE: `${BASE_URL}${apiString}/service__shop/mutate/delete_store`,
};

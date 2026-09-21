import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ZALO_API = {
    CREATE_ZALO_OA: `${BASE_URL}${apiString}/service__zalo/mutate/create_zalo_oa`,
    EDIT_ZALO_OA: `${BASE_URL}${apiString}/service__zalo/mutate/edit_zalo_oa`,
    GET_ZALO_APP_WITH_ACCOUNT_ID: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_app_with_account_id`,
    GET_ZALO_OA_LIST_WITH_2_FK: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_oa_list_with_2_fk`,
    GET_ZALO_OA_WITH_ID: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_oa_with_id`,
    GET_ZALO_OA_WITH_OA_ID: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_oa_with_oa_id`,
    GET_ZALO_USER: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_user_infor`,
    GEN_ZALO_OA_TOKEN: `${BASE_URL}${apiString}/service__zalo/mutate/gen_zalo_oa_token`,
    GET_ZALO_OA_TOKEN_WITH_FK: `${BASE_URL}${apiString}/service__zalo/query/get_zalo_oa_token_with_fk`,
    CREATE_ZALO_OA_TOKEN: `${BASE_URL}${apiString}/service__zalo/mutate/create_zalo_oa_token`,
    UPDATE_REFRESH_TOKEN_OF_ZALO_OA: `${BASE_URL}${apiString}/service__zalo/mutate/update_refresh_token_of_zalo_oa`,
    GET_ZNS_TEMPLATES: `${BASE_URL}${apiString}/service__zalo/query/get_zns_templates`,
    GET_ZNS_TEMPLATE_WITH_ID: `${BASE_URL}${apiString}/service__zalo/query/get_zns_template_with_id`,
    CREATE_ZNS_TEMPLATE: `${BASE_URL}${apiString}/service__zalo/mutate/create_zns_template`,
    EDIT_ZNS_TEMPLATE: `${BASE_URL}${apiString}/service__zalo/mutate/edit_zns_template`,
    GET_ZNS_MESSAGES: `${BASE_URL}${apiString}/service__zalo/query/get_zns_messages`,
    CREATE_ZNS_MESSAGE: `${BASE_URL}${apiString}/service__zalo/mutate/create_zns_message`,
};

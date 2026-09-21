import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const WALLET_API = {
    GET_MY_WALLET_WITH_TYPE: `${BASE_URL}${apiString}/service__wallet/query/get_my_wallet_with_type`,
    GET_BALANCE_FLUCTUATIONS: `${BASE_URL}${apiString}/service__wallet/query/get_balance_fluctuations`,
    PAY_AGENT_FROM_WALLET: `${BASE_URL}${apiString}/service__wallet/mutate/pay_agent_from_wallet`,
    MEMBER_GET_REQUIRE_TAKE_MONEY_OF_WALLET: `${BASE_URL}${apiString}/service__wallet/query/member_get_require_take_money_of_wallet`,
    CREATE_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service__wallet/mutate/create_require_take_money`,
    EDIT_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service__wallet/mutate/edit_require_take_money`,
    DELETE_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service__wallet/mutate/delete_require_take_money`,
};

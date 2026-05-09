import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const WALLET_API = {
    GET_MY_WALLET_WITH_TYPE: `${BASE_URL}${apiString}/service_wallet/query/getMyWalletWithType`,
    GET_BALANCE_FLUCTUATIONS: `${BASE_URL}${apiString}/service_wallet/query/getBalanceFluctuations`,
    PAY_AGENT_FROM_WALLET: `${BASE_URL}${apiString}/service_wallet/mutate/payAgentFromWallet`,
    MEMBER_GET_REQUIRE_TAKE_MONEY_OF_WALLET: `${BASE_URL}${apiString}/service_wallet/query/memberGetRequireTakeMoneyOfWallet`,
    CREATE_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service_wallet/mutate/createRequireTakeMoney`,
    EDIT_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service_wallet/mutate/editRequireTakeMoney`,
    DELETE_REQUIRE_TAKE_MONEY: `${BASE_URL}${apiString}/service_wallet/mutate/deleteRequireTakeMoney`,
};

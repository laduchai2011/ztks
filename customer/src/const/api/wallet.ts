import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const WALLET_API = {
    GET_MY_WALLET_WITH_TYPE: `${BASE_URL}${apiString}/service_wallet/query/getMyWalletWithType`,
    GET_BALANCE_FLUCTUATIONS_BY_DATE: `${BASE_URL}${apiString}/service_wallet/query/getBalanceFluctuationsByDate`,
    GET_BALANCE_FLUCTUATION_LATES_DAY: `${BASE_URL}${apiString}/service_wallet/query/getBalanceFluctuationLatestDay`,
    PAY_AGENT_FROM_WALLET: `${BASE_URL}${apiString}/service_wallet/mutate/payAgentFromWallet`,
};

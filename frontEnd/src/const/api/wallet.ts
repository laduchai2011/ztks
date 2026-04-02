import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const WALLET_API = {
    GET_ALL_WALLETS: `${BASE_URL}${apiString}/service_wallet/query/getAllWallets`,
    GET_BALANCE_FLUCTUATIONS: `${BASE_URL}${apiString}/service_wallet/query/getbalanceFluctuations`,
};

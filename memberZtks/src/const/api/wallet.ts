import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const WALLET_API = {
    MEMBER_ZTKS_CONFIRM_TAKE_MONEY: `${BASE_URL}${apiString}/service_wallet/mutate/memberZtksConfirmTakeMoney`,
    MEMBER_ZTKS_GET_REQUIRES_TAKE_MONEY: `${BASE_URL}${apiString}/service_wallet/query/memberZtksGetRequiresTakeMoney`,
};

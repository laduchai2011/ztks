import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const BANK_API = {
    GET_ALL_BANKS: `${BASE_URL}${apiString}/service_bank/query/getAllBanks`,
    GET_BANK_WITH_ID: `${BASE_URL}${apiString}/service_bank/query/getBankWithId`,
    ADD_BANK: `${BASE_URL}${apiString}/service_bank/mutate/addBank`,
    EDIT_BANK: `${BASE_URL}${apiString}/service_bank/mutate/editBank`,
    DELETE_BANK: `${BASE_URL}${apiString}/service_bank/mutate/deleteBank`,
};

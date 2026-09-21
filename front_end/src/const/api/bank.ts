import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const BANK_API = {
    GET_ALL_BANKS: `${BASE_URL}${apiString}/service__bank/query/get_all_banks`,
    GET_BANK_WITH_ID: `${BASE_URL}${apiString}/service__bank/query/get_bank_with_id`,
    ADD_BANK: `${BASE_URL}${apiString}/service__bank/mutate/add_bank`,
    EDIT_BANK: `${BASE_URL}${apiString}/service__bank/mutate/edit_bank`,
    DELETE_BANK: `${BASE_URL}${apiString}/service__bank/mutate/delete_bank`,
};

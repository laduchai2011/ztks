import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const NOTE_API = {
    GET_NOTES: `${BASE_URL}${apiString}/service__note/query/get_notes`,
    CREATE_NOTE: `${BASE_URL}${apiString}/service__note/mutate/create_note`,
    UPDATE_NOTE: `${BASE_URL}${apiString}/service__note/mutate/update_note`,
    DELETE_NOTE: `${BASE_URL}${apiString}/service__note/mutate/delete_note`,
};

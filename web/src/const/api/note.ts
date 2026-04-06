import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const NOTE_API = {
    GET_NOTES: `${BASE_URL}${apiString}/service_note/query/getNotes`,
    CREATE_NOTE: `${BASE_URL}${apiString}/service_note/mutate/createNote`,
    UPDATE_NOTE: `${BASE_URL}${apiString}/service_note/mutate/updateNote`,
};

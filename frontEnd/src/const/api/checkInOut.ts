import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CHECK_IN_OUT_API = {
    CREATE_CHECK_IN_OUT: `${BASE_URL}${apiString}/service_checkInOut/mutate/createCheckInOut`,
};

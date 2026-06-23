export const isProduct = process.env.NODE_ENV === 'production';

export const BASE_URL = isProduct ? process.env.API_URL : 'http://ztks.local.com:4000';
// export const BASE_URL = process.env.API_URL;

// export const BASE_URL_ZALO_WEBHOOK = 'https://zalowebhook.5kaquarium.com';
const apiString = isProduct ? '' : '/api';
export const BASE_URL_API = `${BASE_URL}${apiString}`;

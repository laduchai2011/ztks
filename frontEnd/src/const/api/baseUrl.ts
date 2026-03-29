export const isProduct = process.env.NODE_ENV === 'production';

export const BASE_URL = isProduct ? process.env.API_URL : 'http://zalo5k.local.com:4000';
console.log('BASE_URL:', BASE_URL);
// export const BASE_URL = process.env.API_URL;

// export const BASE_URL_ZALO_WEBHOOK = 'https://zalowebhook.5kaquarium.com';

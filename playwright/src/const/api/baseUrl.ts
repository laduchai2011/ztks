export const isProduct = process.env.NODE_ENV === 'production';

export const BASE_URL = isProduct ? process.env.API_URL : 'http://localhost:4000';

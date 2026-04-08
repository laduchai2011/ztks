const isProduct = process.env.NODE_ENV === 'production';

export const SOCKET_URL = isProduct ? process.env.SOCKET_URL : 'http://zalo5k.local.com:1000';

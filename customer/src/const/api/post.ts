import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const POST_API = {
    GET_POSTS: `${BASE_URL}${apiString}/service_post/query/getPosts`,
    GET_POST_WITH_ID: `${BASE_URL}${apiString}/service_post/query/getPostWithId`,
    GET_REGISTER_POST_WITH_ID: `${BASE_URL}${apiString}/service_post/query/getRegisterPostWithId`,
};

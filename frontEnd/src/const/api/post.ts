import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const POST_API = {
    GET_REGISTER_POSTS: `${BASE_URL}${apiString}/service_post/query/getRegisterPosts`,
    GET_POSTS: `${BASE_URL}${apiString}/service_post/query/getPosts`,
    GET_POST_WITH_ID: `${BASE_URL}${apiString}/service_post/query/getPostWithId`,
    CREATE_REGISTER_POST: `${BASE_URL}${apiString}/service_post/mutate/createRegisterPost`,
    EDIT_REGISTER_POST: `${BASE_URL}${apiString}/service_post/mutate/editRegisterPost`,
    DELETE_REGISTER_POST: `${BASE_URL}${apiString}/service_post/mutate/deleteRegisterPost`,
    CREATE_POST: `${BASE_URL}${apiString}/service_post/mutate/createPost`,
    EDIT_POST: `${BASE_URL}${apiString}/service_post/mutate/editPost`,
};

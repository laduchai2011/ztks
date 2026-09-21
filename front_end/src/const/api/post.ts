import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const POST_API = {
    GET_REGISTER_POSTS: `${BASE_URL}${apiString}/service__post/query/get_register_posts`,
    GET_POSTS: `${BASE_URL}${apiString}/service__post/query/get_posts`,
    GET_POST_WITH_ID: `${BASE_URL}${apiString}/service__post/query/get_post_with_id`,
    CREATE_REGISTER_POST: `${BASE_URL}${apiString}/service__post/mutate/create_register_post`,
    EDIT_REGISTER_POST: `${BASE_URL}${apiString}/service__post/mutate/edit_register_post`,
    DELETE_REGISTER_POST: `${BASE_URL}${apiString}/service__post/mutate/delete_register_post`,
    CREATE_POST: `${BASE_URL}${apiString}/service__post/mutate/create_post`,
    EDIT_POST: `${BASE_URL}${apiString}/service__post/mutate/edit_post`,
};

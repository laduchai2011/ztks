import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ACCOUNT_API = {
    SIGNUP: `${BASE_URL}${apiString}/service__account/mutate/signup`,
    SIGNIN: `${BASE_URL}${apiString}/service__account/mutate/signin`,
    SIGNOUT: `${BASE_URL}${apiString}/service__account/mutate/signout`,
    // ADD_MEMBER: `${BASE_URL}${apiString}/service_account/mutate/addMember`,
    GET_ALL_MEMBERS: `${BASE_URL}${apiString}/service__account/query/get_all_members`,
    GET_ACCOUNT_WITH_ID: `${BASE_URL}${apiString}/service__account/query/get_account_with_id`,
    GET_REPLY_ACCOUNTS: `${BASE_URL}${apiString}/service__account/query/get_reply_accounts`,
    GET_NOT_REPLY_ACCOUNTS: `${BASE_URL}${apiString}/service__account/query/get_not_reply_accounts`,
    CREATE_REPLY_ACCOUNT: `${BASE_URL}${apiString}/service__account/mutate/create_reply_account`,
    GET_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service__account/query/get_account_receive_message`,
    CREATE_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service__account/mutate/create_account_receive_message`,
    UPDATE_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service__account/mutate/update_account_receive_message`,
    GET_MEMBERS: `${BASE_URL}${apiString}/service__account/query/get_members`,
    ADD_MEMBERV1: `${BASE_URL}${apiString}/service__account/mutate/add_member_v1`,
    FORGET_PASSWORD: `${BASE_URL}${apiString}/service__account/mutate/forget_password`,
    CHECK_FORGET_PASSWORD: `${BASE_URL}${apiString}/service__account/query/check_forget_password`,
    GET_MY_RECOMMEND: `${BASE_URL}${apiString}/service__account/query/get_my_recommend`,
    ADD_YOUR_RECOMMEND: `${BASE_URL}${apiString}/service__account/mutate/add_your_recommend`,
    LEAVE_ALL_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service__account/mutate/leave_all_account_receive_message`,
    LEAVE_ADMIN: `${BASE_URL}${apiString}/service__account/mutate/leave_admin`,
};

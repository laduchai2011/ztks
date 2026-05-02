import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const ACCOUNT_API = {
    SIGNUP: `${BASE_URL}${apiString}/service_account/mutate/signup`,
    SIGNIN: `${BASE_URL}${apiString}/service_account/mutate/signin`,
    SIGNOUT: `${BASE_URL}${apiString}/service_account/mutate/signout`,
    ADD_MEMBER: `${BASE_URL}${apiString}/service_account/mutate/addMember`,
    GET_ALL_MEMBERS: `${BASE_URL}${apiString}/service_account/query/getAllMembers`,
    SET_MEMBER_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/mutate/setMemberReceiveMessage`,
    GET_MEMBER_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/query/getMemberReceiveMessage`,
    GET_ACCOUNT_WITH_ID: `${BASE_URL}${apiString}/service_account/query/getAccountWithId`,
    GET_REPLY_ACCOUNt: `${BASE_URL}${apiString}/service_account/query/getReplyAccounts`,
    GET_NOT_REPLY_ACCOUNT: `${BASE_URL}${apiString}/service_account/query/getNotReplyAccounts`,
    CREATE_REPLY_ACCOUNT: `${BASE_URL}${apiString}/service_account/mutate/createReplyAccount`,
    GET_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/query/getAccountReceiveMessage`,
    CREATE_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/mutate/createAccountReceiveMessage`,
    UPDATE_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/mutate/updateAccountReceiveMessage`,
    GET_MEMBERS: `${BASE_URL}${apiString}/service_account/query/getMembers`,
    ADD_MEMBERV1: `${BASE_URL}${apiString}/service_account/mutate/addMemberV1`,
    FORGET_PASSWORD: `${BASE_URL}${apiString}/service_account/mutate/forgetPassword`,
    CHECK_FORGET_PASSWORD: `${BASE_URL}${apiString}/service_account/query/checkForgetPassword`,
    GET_MY_RECOMMEND: `${BASE_URL}${apiString}/service_account/query/getMyRecommend`,
    ADD_YOUR_RECOMMEND: `${BASE_URL}${apiString}/service_account/mutate/addYourRecommend`,
    LEAVE_ALL_ACCOUNT_RECEIVE_MESSAGE: `${BASE_URL}${apiString}/service_account/mutate/leaveAllAccountReceiveMessage`,
};

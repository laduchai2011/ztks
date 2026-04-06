import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_IsSignin from './handle/IsSignin';
import Handle_GetAllMembers from './handle/GetAllMembers';
import Handle_GetMemberReceiveMessage from './handle/GetMemberReceiveMessage';
import Handle_GetAccountInformation from './handle/GetAccountInformation';
import Handle_GetMe from './handle/GetMe';
import Handle_GetAccountWithId from './handle/GetAccountWithId';
import Handle_GetReplyAccounts from './handle/GetReplyAccounts';
import Handle_GetNotReplyAccounts from './handle/GetNotReplyAccounts';
import Handle_GetAccountReceiveMessage from './handle/GetAccountReceiveMessage';
import Handle_GetMembers from './handle/GetMembers';
import Handle_CheckForgetPassword from './handle/CheckForgetPassword';
import Handle_GetMyRecommend from './handle/GetMyRecommend';

dotenv.config();
const router_query_account: Router = express.Router();

const handle_isSignin = new Handle_IsSignin();
const handle_getAllMembers = new Handle_GetAllMembers();
const handle_getMemberReceiveMessage = new Handle_GetMemberReceiveMessage();
const handle_getAccountInformation = new Handle_GetAccountInformation();
const handle_getMe = new Handle_GetMe();
const handle_getAccountWithId = new Handle_GetAccountWithId();
const handle_getReplyAccounts = new Handle_GetReplyAccounts();
const handle_getNotReplyAccounts = new Handle_GetNotReplyAccounts();
const handle_getAccountReceiveMessage = new Handle_GetAccountReceiveMessage();
const handle_getMembers = new Handle_GetMembers();
const handle_checkForgetPassword = new Handle_CheckForgetPassword();
const handle_getMyRecommend = new Handle_GetMyRecommend();

router_query_account.get('/isSignin', authentication, handle_isSignin.main);

router_query_account.post('/getAllMembers', authentication, handle_getAllMembers.setup, handle_getAllMembers.main);

router_query_account.get('/getMemberReceiveMessage', authentication, handle_getMemberReceiveMessage.main);

router_query_account.get(
    '/getAccountInformation',
    authentication,
    handle_getAccountInformation.setup,
    handle_getAccountInformation.main
);

router_query_account.get('/getMe', authentication, handle_getMe.setup, handle_getMe.main);

router_query_account.get('/getAccountWithId', authentication, handle_getAccountWithId.main);

router_query_account.post('/getReplyAccounts', authentication, handle_getReplyAccounts.main);

router_query_account.post('/getNotReplyAccounts', authentication, handle_getNotReplyAccounts.main);

router_query_account.post('/getAccountReceiveMessage', authentication, handle_getAccountReceiveMessage.main);

router_query_account.post('/getMembers', authentication, handle_getMembers.setup, handle_getMembers.main);

router_query_account.post('/checkForgetPassword', handle_checkForgetPassword.main);

router_query_account.post('/getMyRecommend', authentication, handle_getMyRecommend.setup, handle_getMyRecommend.main);

export default router_query_account;

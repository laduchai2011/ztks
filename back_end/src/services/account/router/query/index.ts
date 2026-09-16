import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Is_Signin from './handle/Is_signin';
import Handle_Get_All_Members from './handle/Get_All_Members';
import Handle_Get_Account_Information from './handle/Get_Account_Information';
import Handle_Get_Me from './handle/Get_Me';
import Handle_Get_Account_With_Id from './handle/Get_Account_With_Id';
import Handle_Get_Reply_Accounts from './handle/Get_Reply_Accounts';
import Handle_Get_Not_Reply_Accounts from './handle/Get_Not_Reply_Accounts';
import Handle_Get_Account_Receive_Message from './handle/Get_Account_Receive_Message';
import Handle_Get_Members from './handle/Get_Members';
import Handle_Check_Forget_Password from './handle/Check_Forget_Password';
import Handle_Get_My_Recommend from './handle/Get_My_Recommend';

dotenv.config();
const router_query_account: Router = express.Router();

const handle_is_signin = new Handle_Is_Signin();
const handle_get_all_members = new Handle_Get_All_Members();
const handle_get_account_information = new Handle_Get_Account_Information();
const handle_get_me = new Handle_Get_Me();
const handle_get_account_with_id = new Handle_Get_Account_With_Id();
const handle_get_reply_accounts = new Handle_Get_Reply_Accounts();
const handle_get_not_reply_accounts = new Handle_Get_Not_Reply_Accounts();
const handle_get_account_receive_message = new Handle_Get_Account_Receive_Message();
const handle_get_members = new Handle_Get_Members();
const handle_check_forget_password = new Handle_Check_Forget_Password();
const handle_get_my_recommend = new Handle_Get_My_Recommend();

router_query_account.get('/is_signin', authentication, handle_is_signin.main);

router_query_account.post('/get_all_members', authentication, handle_get_all_members.setup, handle_get_all_members.main);

router_query_account.get(
    '/get_account_information',
    authentication,
    handle_get_account_information.setup,
    handle_get_account_information.main
);

router_query_account.get('/get_me', authentication, handle_get_me.setup, handle_get_me.main);

router_query_account.get('/get_account_with_id', authentication, handle_get_account_with_id.main);

router_query_account.post('/get_reply_accounts', authentication, handle_get_reply_accounts.main);

router_query_account.post('/get_not_reply_accounts', authentication, handle_get_not_reply_accounts.main);

router_query_account.post('/get_account_receive_message', authentication, handle_get_account_receive_message.main);

router_query_account.post('/get_members', authentication, handle_get_members.main);

router_query_account.post('/check_forget_password', handle_check_forget_password.main);

router_query_account.post('/get_my_recommend', authentication, handle_get_my_recommend.setup, handle_get_my_recommend.main);

export default router_query_account;

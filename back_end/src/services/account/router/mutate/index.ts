import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import { authOtpFirebaseMiddleware } from '@src/otp';
import Handle_Signup from './handle/Signup';
import Handle_Signin from './handle/Signin';
import Handle_Signout from './handle/Signout';
import Handle_Create_Reply_Account from './handle/Create_Reply_Account';
import Handle_Create_Account_Receive_Message from './handle/Create_Account_Receive_Message';
import Handle_UpdateAccountReceiveMessage from './handle/UpdateAccountReceiveMessage';
import Handle_Add_Member_V1 from './handle/Add_Member_V1';
import Handle_Create_Account_Information from './handle/Create_Account_Information';
import Handle_Edit_Infor_Account from './handle/Edit_Infor_Account';
import Handle_Forget_Password from './handle/Forget_Password';
import Handle_Add_Your_Recommend from './handle/Add_Your_Recommend';
import Handle_Leave_All_Account_Receive_Message from './handle/Leave_All_Account_Receive_Message';
import Handle_Leave_Admin from './handle/Leave_Admin';

dotenv.config();

const router_mutate_account: Router = express.Router();
const handle_signup = new Handle_Signup();
const handle_signin = new Handle_Signin();
const handle_signout = new Handle_Signout();
const handle_create_reply_account = new Handle_Create_Reply_Account();
const handle_create_account_receive_message = new Handle_Create_Account_Receive_Message();
const handle_updateAccountReceiveMessage = new Handle_UpdateAccountReceiveMessage();
const handle_add_member_v1 = new Handle_Add_Member_V1();
const handle_create_account_information = new Handle_Create_Account_Information();
const handle_edit_infor_account = new Handle_Edit_Infor_Account();
const handle_forget_password = new Handle_Forget_Password();
const handle_add_your_recommend = new Handle_Add_Your_Recommend();
const handle_leave_all_account_receive_message = new Handle_Leave_All_Account_Receive_Message();
const handle_leave_admin = new Handle_Leave_Admin();

router_mutate_account.post('/', (_: Request, res: Response) => {
    res.send('(POST) Express + TypeScript Server: router_mutate_account');
});

router_mutate_account.post(
    '/signup',
    handle_signup.isAccountCheckUserName,
    handle_signup.isAccountCheckPhone,
    authOtpFirebaseMiddleware,
    handle_signup.main
);

router_mutate_account.post('/signin', handle_signin.main);

router_mutate_account.post('/signout', handle_signout.main);

router_mutate_account.post(
    '/create_reply_account',
    authentication,
    handle_create_reply_account.setup,
    handle_create_reply_account.get_Zalo_Oa_Id,
    handle_create_reply_account.main
);

router_mutate_account.post(
    '/create_account_receive_message',
    authentication,
    handle_create_account_receive_message.setup,
    handle_create_account_receive_message.main
);

router_mutate_account.post(
    '/updateAccountReceiveMessage',
    authentication,
    handle_updateAccountReceiveMessage.setup,
    handle_updateAccountReceiveMessage.main
);

router_mutate_account.post('/add_member_v1', authentication, handle_add_member_v1.setup, handle_add_member_v1.main);

router_mutate_account.post(
    '/create_account_information',
    authentication,
    handle_create_account_information.setup,
    handle_create_account_information.main
);

router_mutate_account.post(
    '/edit_infor_account',
    authentication,
    handle_edit_infor_account.setup,
    handle_edit_infor_account.main
);

router_mutate_account.post('/forget_password', authOtpFirebaseMiddleware, handle_forget_password.main);

router_mutate_account.post('/add_your_recommend', handle_add_your_recommend.setup, handle_add_your_recommend.main);

router_mutate_account.patch(
    '/leave_all_account_receive_message',
    authentication,
    handle_leave_all_account_receive_message.setup,
    handle_leave_all_account_receive_message.main
);

router_mutate_account.patch('/leave_admin', authentication, handle_leave_admin.setup, handle_leave_admin.main);

export default router_mutate_account;

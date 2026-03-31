import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import { authOtpFirebaseMiddleware } from '@src/otp';
import Handle_Signup from './handle/Signup';
import Handle_Signin from './handle/Signin';
import Handle_Signout from './handle/Signout';
import Handle_AddMember from './handle/AddMember';
// import Handle_SetMemberReceiveMessage from './handle/SetMemberReceiveMessage';
import Handle_CreateReplyAccount from './handle/CreateReplyAccount';
import Handle_CreateAccountReceiveMessage from './handle/CreateAccountReceiveMessage';
import Handle_UpdateAccountReceiveMessage from './handle/UpdateAccountReceiveMessage';
import Handle_AddMemberV1 from './handle/AddMemberV1';
import Handle_CreateAccountInformation from './handle/CreateAccountInformation';
import Handle_EditInforAccount from './handle/EditInforAccount';
import Handle_ForgetPassword from './handle/ForgetPassword';

dotenv.config();

const router_mutate_account: Router = express.Router();
const handle_signup = new Handle_Signup();
const handle_signin = new Handle_Signin();
const handle_signout = new Handle_Signout();
const handle_addMember = new Handle_AddMember();
// const handle_setMemberReceiveMessage = new Handle_SetMemberReceiveMessage();
const handle_createReplyAccount = new Handle_CreateReplyAccount();
const handle_createAccountReceiveMessage = new Handle_CreateAccountReceiveMessage();
const handle_updateAccountReceiveMessage = new Handle_UpdateAccountReceiveMessage();
const handle_addMemberV1 = new Handle_AddMemberV1();
const handle_createAccountInformation = new Handle_CreateAccountInformation();
const handle_editInforAccount = new Handle_EditInforAccount();
const handle_forgetPassword = new Handle_ForgetPassword();

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

router_mutate_account.post(
    '/addMember',
    authentication,
    handle_addMember.isAccountCheckUserName,
    handle_addMember.isAccountCheckPhone,
    handle_addMember.setup,
    handle_addMember.main
);

// router_mutate_account.post('/setMemberReceiveMessage', authentication, handle_setMemberReceiveMessage.main);

router_mutate_account.post('/signin', handle_signin.main);

router_mutate_account.post('/signout', handle_signout.main);

router_mutate_account.post(
    '/createReplyAccount',
    authentication,
    handle_createReplyAccount.setup,
    handle_createReplyAccount.getZaloOaId,
    handle_createReplyAccount.main
);

router_mutate_account.post(
    '/createAccountReceiveMessage',
    authentication,
    handle_createAccountReceiveMessage.setup,
    handle_createAccountReceiveMessage.main
);

router_mutate_account.post(
    '/updateAccountReceiveMessage',
    authentication,
    handle_updateAccountReceiveMessage.setup,
    handle_updateAccountReceiveMessage.main
);

router_mutate_account.post('/addMemberV1', authentication, handle_addMemberV1.setup, handle_addMemberV1.main);

router_mutate_account.post(
    '/createAccountInformation',
    authentication,
    handle_createAccountInformation.setup,
    handle_createAccountInformation.main
);

router_mutate_account.post(
    '/editInforAccount',
    authentication,
    handle_editInforAccount.setup,
    handle_editInforAccount.main
);

router_mutate_account.post('/forgetPassword', authOtpFirebaseMiddleware, handle_forgetPassword.main);

export default router_mutate_account;

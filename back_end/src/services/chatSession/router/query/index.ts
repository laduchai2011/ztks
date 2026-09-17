import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Get_Chat_Sessions_With_Account_Id from './handle/Get_Chat_Sessions_With_Account_Id';

const router_query_chatSession: Router = express.Router();

const handle_get_chat_sessions_with_account_id = new Handle_Get_Chat_Sessions_With_Account_Id();

router_query_chatSession.post(
    '/get_chat_sessions_with_account_id',
    authentication,
    handle_get_chat_sessions_with_account_id.main
);

export default router_query_chatSession;

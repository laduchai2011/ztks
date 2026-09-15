import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_GetChatSessionsWithAccountId from './handle/GetChatSessionsWithAccountId';

const router_query_chatSession: Router = express.Router();

const handle_getChatSessionsWithAccountId = new Handle_GetChatSessionsWithAccountId();

router_query_chatSession.post(
    '/getChatSessionsWithAccountId',
    authentication,
    handle_getChatSessionsWithAccountId.main
);

export default router_query_chatSession;

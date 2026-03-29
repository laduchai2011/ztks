import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateChatSession from './handle/CreateChatSession';
import Handle_UpdateSelectedAccountIdOfChatSession from './handle/UpdateSelectedAccountIdOfChatSession';
import Handle_UpdateIsReadyOfChatSession from './handle/UpdateIsReadyOfChatSession';

dotenv.config();

const router_mutate_chatSession: Router = express.Router();
const handle_createChatSession = new Handle_CreateChatSession();
const handle_updateSelectedAccountIdOfChatSession = new Handle_UpdateSelectedAccountIdOfChatSession();
const handle_updateIsReadyOfChatSession = new Handle_UpdateIsReadyOfChatSession();

router_mutate_chatSession.post(
    '/createChatSession',
    authentication,
    handle_createChatSession.setup,
    handle_createChatSession.isMyOa,
    handle_createChatSession.main
);

router_mutate_chatSession.patch(
    '/updateSelectedAccountIdOfChatSession',
    authentication,
    handle_updateSelectedAccountIdOfChatSession.setup,
    handle_updateSelectedAccountIdOfChatSession.main
);

router_mutate_chatSession.patch(
    '/updateIsReadyOfChatSession',
    authentication,
    handle_updateIsReadyOfChatSession.setup,
    handle_updateIsReadyOfChatSession.main
);

export default router_mutate_chatSession;

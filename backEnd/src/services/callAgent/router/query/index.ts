import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetCallAgentWithAccountId from './handle/GetCallAgentWithAccountId';

dotenv.config();

const router_query_callAgent: Router = express.Router();

const handle_getCallAgentWithAccountId = new Handle_GetCallAgentWithAccountId();

router_query_callAgent.post(
    '/getCallAgentWithAccountId',
    authentication,
    handle_getCallAgentWithAccountId.setup,
    handle_getCallAgentWithAccountId.main
);

export default router_query_callAgent;

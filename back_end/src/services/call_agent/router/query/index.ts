import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Call_Agent_With_Account_Id from './handle/Get_Call_Agent_With_Account_Id';

dotenv.config();

const router_query_callAgent: Router = express.Router();

const handle_get_call_agent_with_account_id = new Handle_Get_Call_Agent_With_Account_Id();

router_query_callAgent.post(
    '/get_call_agent_with_account_id',
    authentication,
    handle_get_call_agent_with_account_id.setup,
    handle_get_call_agent_with_account_id.main
);

export default router_query_callAgent;

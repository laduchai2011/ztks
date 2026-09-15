import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateAgent from './handle/CreateAgent';
import Handle_AgentAddAccount from './handle/AgentAddAccount';
import Handle_AgentDelAccount from './handle/AgentDelAccount';
import Handle_CreateAgentPay from './handle/CreateAgentPay';

dotenv.config();

const router_mutate_agent: Router = express.Router();
const handle_createAgent = new Handle_CreateAgent();
const handle_agentAddAccount = new Handle_AgentAddAccount();
const handle_agentDelAccount = new Handle_AgentDelAccount();
const handle_createAgentPay = new Handle_CreateAgentPay();

router_mutate_agent.post('/createAgent', authentication, handle_createAgent.setup, handle_createAgent.main);

router_mutate_agent.patch(
    '/agentAddAccount',
    authentication,
    handle_agentAddAccount.setup,
    handle_agentAddAccount.main
);

router_mutate_agent.patch(
    '/agentDelAccount',
    authentication,
    handle_agentDelAccount.setup,
    handle_agentDelAccount.main
);

router_mutate_agent.post('/createAgentPay', authentication, handle_createAgentPay.setup, handle_createAgentPay.main);

export default router_mutate_agent;

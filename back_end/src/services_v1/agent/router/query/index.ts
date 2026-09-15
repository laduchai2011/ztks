import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetAgentWithId from './handle/GetAgentWithId';
import Handle_GetAgentWithAgentAccountId from './handle/GetAgentWithAgentAccountId';
import Handle_GetAgents from './handle/GetAgents';
import Handle_GetLastAgentPay from './handle/GetLastAgentPay';

dotenv.config();
const router_query_agent: Router = express.Router();

const handle_getAgentWithId = new Handle_GetAgentWithId();
const handle_getAgentWithAgentAccountId = new Handle_GetAgentWithAgentAccountId();
const handle_getAgents = new Handle_GetAgents();
const handle_getLastAgentPay = new Handle_GetLastAgentPay();

router_query_agent.get('/getAgentWithId', authentication, handle_getAgentWithId.main);

router_query_agent.post('/getAgentWithAgentAccountId', authentication, handle_getAgentWithAgentAccountId.main);

router_query_agent.post('/getAgents', authentication, handle_getAgents.setup, handle_getAgents.main);

router_query_agent.post('/getLastAgentPay', authentication, handle_getLastAgentPay.setup, handle_getLastAgentPay.main);

export default router_query_agent;

import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Agent from './handle/Create_Agent';
import Handle_Agent_Add_Account from './handle/Agent_Add_Account';
import Handle_Agent_Del_Account from './handle/Agent_Del_Account';
import Handle_Create_Agent_Pay from './handle/Create_Agent_Pay';

dotenv.config();

const router_mutate_agent: Router = express.Router();
const handle_create_agent = new Handle_Create_Agent();
const handle_agent_add_account = new Handle_Agent_Add_Account();
const handle_agent_del_account = new Handle_Agent_Del_Account();
const handle_create_agent_pay = new Handle_Create_Agent_Pay();

router_mutate_agent.post('/create_agent', authentication, handle_create_agent.setup, handle_create_agent.main);

router_mutate_agent.patch(
    '/agent_add_account',
    authentication,
    handle_agent_add_account.setup,
    handle_agent_add_account.main
);

router_mutate_agent.patch(
    '/agent_del_account',
    authentication,
    handle_agent_del_account.setup,
    handle_agent_del_account.main
);

router_mutate_agent.post('/create_agent_pay', authentication, handle_create_agent_pay.setup, handle_create_agent_pay.main);

export default router_mutate_agent;

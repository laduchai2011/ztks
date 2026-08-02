import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateZaloTrunk from './handle/CreateZaloTrunk';

dotenv.config();

const router_mutate_callAgent: Router = express.Router();

const handle_createZaloTrunk = new Handle_CreateZaloTrunk();

router_mutate_callAgent.post(
    '/createZaloTrunk',
    authentication,
    handle_createZaloTrunk.setup,
    handle_createZaloTrunk.main
);

export default router_mutate_callAgent;

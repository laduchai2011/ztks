import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Zalo_Trunk from './handle/Create_Zalo_Trunk';

dotenv.config();

const router_mutate_callAgent: Router = express.Router();

const handle_create_zalo_trunk = new Handle_Create_Zalo_Trunk();

router_mutate_callAgent.post(
    '/create_zalo_trunk',
    authentication,
    handle_create_zalo_trunk.setup,
    handle_create_zalo_trunk.main
);

export default router_mutate_callAgent;

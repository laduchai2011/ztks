import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Order_V1 from './handle/Create_Order_V1';

dotenv.config();

const router_mutate_order_v1: Router = express.Router();

const handle_create_order_v1 = new Handle_Create_Order_V1();

router_mutate_order_v1.post(
    '/create_order_v1',
    authentication,
    handle_create_order_v1.setup,
    handle_create_order_v1.main
);

export default router_mutate_order_v1;

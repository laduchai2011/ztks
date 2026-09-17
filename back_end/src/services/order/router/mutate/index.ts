import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Order from './handle/Create_Order';
import Handle_Update_Order from './handle/Update_Order';
import Handle_Create_Order_Status from './handle/Create_Order_Status';

dotenv.config();

const router_mutate_order: Router = express.Router();

const handle_create_order = new Handle_Create_Order();
const handle_update_order = new Handle_Update_Order();
const handle_create_order_status = new Handle_Create_Order_Status();

router_mutate_order.post('/create_order', authentication, handle_create_order.setup, handle_create_order.main);

router_mutate_order.patch('/update_order', authentication, handle_update_order.setup, handle_update_order.main);

router_mutate_order.post(
    '/create_order_status',
    authentication,
    handle_create_order_status.setup,
    handle_create_order_status.main
);

export default router_mutate_order;

import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateOrder from './handle/CreateOrder';
import Handle_UpdateOrder from './handle/UpdateOrder';
import Handle_CreateOrderStatus from './handle/CreateOrderStatus';
import Handle_OrderSelectVoucher from './handle/OrderSelectVoucher';

dotenv.config();

const router_mutate_order: Router = express.Router();

const handle_createOrder = new Handle_CreateOrder();
const handle_updateOrder = new Handle_UpdateOrder();
const handle_createOrderStatus = new Handle_CreateOrderStatus();
const handle_orderSelectVoucher = new Handle_OrderSelectVoucher();

router_mutate_order.post(
    '/createOrder',
    authentication,
    handle_createOrder.setup,
    handle_createOrder.isChatRoom,
    handle_createOrder.main
);

router_mutate_order.patch(
    '/updateOrder',
    authentication,
    handle_updateOrder.setup,
    handle_updateOrder.isMyOrder,
    handle_updateOrder.main
);

router_mutate_order.post(
    '/createOrderStatus',
    authentication,
    handle_createOrderStatus.setup,
    handle_createOrderStatus.main
);

router_mutate_order.post(
    '/orderSelectVoucher',
    authentication,
    handle_orderSelectVoucher.setup,
    handle_orderSelectVoucher.isMyOrder,
    handle_orderSelectVoucher.main
);

export default router_mutate_order;

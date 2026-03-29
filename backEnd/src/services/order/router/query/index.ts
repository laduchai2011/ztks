import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetOrders from './handle/GetOrders';
import Handle_GetAllOrderStatus from './handle/GetAllOrderStatus';
import Handle_GetOrderWithId from './handle/GetOrderWithId';

dotenv.config();
const router_query_order: Router = express.Router();

const handle_getOrders = new Handle_GetOrders();
const handle_getAllOrderStatus = new Handle_GetAllOrderStatus();
const handle_getOrderWithId = new Handle_GetOrderWithId();

router_query_order.post('/getOrders', authentication, handle_getOrders.setup, handle_getOrders.main);

router_query_order.post('/getAllOrderStatus', authentication, handle_getAllOrderStatus.main);

router_query_order.get('/getOrderWithId', handle_getOrderWithId.main);

export default router_query_order;

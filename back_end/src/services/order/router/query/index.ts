import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Get_Orders from './handle/Get_Orders';
import Handle_Get_All_Order_Status from './handle/Get_All_Order_Status';
import Handle_Get_Order_With_Id from './handle/Get_Order_With_Id';
import Handle_Get_Orders_With_Phone from './handle/Get_Orders_With_Phone';

dotenv.config();
const router_query_order: Router = express.Router();

const handle_get_orders = new Handle_Get_Orders();
const handle_get_all_order_status = new Handle_Get_All_Order_Status();
const handle_get_order_with_id = new Handle_Get_Order_With_Id();
const handle_get_orders_with_phone = new Handle_Get_Orders_With_Phone();

router_query_order.post('/get_orders', authentication, handle_get_orders.setup, handle_get_orders.main);

router_query_order.post('/get_all_order_status', handle_get_all_order_status.main);

router_query_order.get('/get_order_with_id', handle_get_order_with_id.main);

router_query_order.post('/get_orders_with_phone', handle_get_orders_with_phone.main);

export default router_query_order;

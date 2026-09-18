import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Vouchers from './handle/Get_Vouchers';
import Handle_Get_Voucher_With_Order_Id from './handle/Get_Voucher_With_Order_Id';

dotenv.config();

const router_query_voucher: Router = express.Router();

const handle_get_vouchers = new Handle_Get_Vouchers();
const handle_get_voucher_with_order_id = new Handle_Get_Voucher_With_Order_Id();

router_query_voucher.post('/get_vouchers', handle_get_vouchers.main);

router_query_voucher.post('/get_voucher_with_order_id', handle_get_voucher_with_order_id.main);

export default router_query_voucher;

import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetVouchers from './handle/GetVouchers';
import Handle_GetVoucherWithOrderId from './handle/GetVoucherWithOrderId';

dotenv.config();

const router_query_voucher: Router = express.Router();

const handle_getVouchers = new Handle_GetVouchers();
const handle_getVoucherWithOrderId = new Handle_GetVoucherWithOrderId();

router_query_voucher.post('/getVouchers', handle_getVouchers.main);

router_query_voucher.post('/getVoucherWithOrderId', authentication, handle_getVoucherWithOrderId.main);

export default router_query_voucher;

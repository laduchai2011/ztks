import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import authentication_customer from '@src/auth/customer';
import Handle_CreateVoucher from './handle/CreateVoucher';
import Handle_CustomerUseVoucher from './handle/CustomerUseVoucher';

dotenv.config();

const router_mutate_voucher: Router = express.Router();

const handle_createVoucher = new Handle_CreateVoucher();
const handle_customerUseVoucher = new Handle_CustomerUseVoucher();

router_mutate_voucher.post('/createVoucher', authentication, handle_createVoucher.setup, handle_createVoucher.main);

router_mutate_voucher.post(
    '/customerUseVoucher',
    authentication_customer,
    handle_customerUseVoucher.setup,
    handle_customerUseVoucher.main
);

export default router_mutate_voucher;

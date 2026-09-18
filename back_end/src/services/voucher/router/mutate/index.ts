import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import authentication_customer from '@src/auth/customer';
import Handle_Create_Voucher from './handle/Create_Voucher';
import Handle_Customer_Use_Voucher from './handle/Customer_Use_Voucher';

dotenv.config();

const router_mutate_voucher: Router = express.Router();

const handle_create_voucher = new Handle_Create_Voucher();
const handle_customer_use_voucher = new Handle_Customer_Use_Voucher();

router_mutate_voucher.post('/create_voucher', authentication, handle_create_voucher.setup, handle_create_voucher.main);

router_mutate_voucher.post(
    '/customer_use_voucher',
    authentication_customer,
    handle_customer_use_voucher.setup,
    handle_customer_use_voucher.main
);

export default router_mutate_voucher;

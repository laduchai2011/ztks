import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateVoucher from './handle/CreateVoucher';

dotenv.config();

const router_mutate_voucher: Router = express.Router();

const handle_createVoucher = new Handle_CreateVoucher();

router_mutate_voucher.post('/createVoucher', authentication, handle_createVoucher.setup, handle_createVoucher.main);

export default router_mutate_voucher;

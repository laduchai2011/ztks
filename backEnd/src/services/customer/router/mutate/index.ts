import express, { Router } from 'express';
import dotenv from 'dotenv';
import { authOtpFirebaseMiddleware } from '@src/otp';
import Handle_CreateCustomer from './handle/CreateCustomer';
import Handle_CustomerForgetPassword from './handle/CustomerForgetPassword';
import Handle_CustomerSignout from './handle/CustomerSignout';

dotenv.config();

const router_mutate_customer: Router = express.Router();

const handle_createCustomer = new Handle_CreateCustomer();
const handle_customerForgetPassword = new Handle_CustomerForgetPassword();
const handle_customerSignout = new Handle_CustomerSignout();

router_mutate_customer.post(
    '/createCustomer',
    handle_createCustomer.isCheckPhone,
    authOtpFirebaseMiddleware,
    handle_createCustomer.main
);

router_mutate_customer.post('/customerForgetPassword', authOtpFirebaseMiddleware, handle_customerForgetPassword.main);

router_mutate_customer.post('/customerSignout', handle_customerSignout.main);

export default router_mutate_customer;

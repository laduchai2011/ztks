import express, { Router } from 'express';
import dotenv from 'dotenv';
import { authOtpFirebaseMiddleware } from '@src/otp';
import Handle_Create_Customer from './handle/Create_Customer';
import Handle_Customer_Forget_Password from './handle/Customer_Forget_Password';
import Handle_Customer_Signout from './handle/Customer_Signout';

dotenv.config();

const router_mutate_customer: Router = express.Router();

const handle_create_customer = new Handle_Create_Customer();
const handle_customer_forget_password = new Handle_Customer_Forget_Password();
const handle_customer_signout = new Handle_Customer_Signout();

router_mutate_customer.post(
    '/create_customer',
    handle_create_customer.is_Check_Phone,
    authOtpFirebaseMiddleware,
    handle_create_customer.main
);

router_mutate_customer.post(
    '/customer_forget_password',
    authOtpFirebaseMiddleware,
    handle_customer_forget_password.main
);

router_mutate_customer.post('/customer_signout', handle_customer_signout.main);

export default router_mutate_customer;

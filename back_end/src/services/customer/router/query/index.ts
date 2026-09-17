import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication_customer from '@src/auth/customer';
import Handle_Signin from './handle/Signin';
import Handle_Customer_Get_Me from './handle/Get_Me';

dotenv.config();

const router_query_customer: Router = express.Router();

const handle_signin = new Handle_Signin();
const handle_customer_get_me = new Handle_Customer_Get_Me();

router_query_customer.post('/signin_customer', handle_signin.main);

router_query_customer.get(
    '/get_me',
    authentication_customer,
    handle_customer_get_me.setup,
    handle_customer_get_me.main
);

export default router_query_customer;

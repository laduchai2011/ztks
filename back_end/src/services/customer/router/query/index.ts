import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication_customer from '@src/auth/customer';
import Handle_Signin from './handle/Signin';
import Handle_CustomerGetMe from './handle/GetMe';

dotenv.config();

const router_query_customer: Router = express.Router();

const handle_signin = new Handle_Signin();
const handle_customerGetMe = new Handle_CustomerGetMe();

router_query_customer.post('/signinCustomer', handle_signin.main);

router_query_customer.get('/getMe', authentication_customer, handle_customerGetMe.setup, handle_customerGetMe.main);

export default router_query_customer;

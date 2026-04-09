import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Signin from './handle/Signin';

dotenv.config();

const router_query_customer: Router = express.Router();

const handle_signin = new Handle_Signin();

router_query_customer.post('/signinCustomer', handle_signin.main);

export default router_query_customer;

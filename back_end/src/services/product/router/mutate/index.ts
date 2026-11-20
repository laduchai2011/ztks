import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Product_Code from './handle/Create_Product_Code';
import Handle_Create_Product from './handle/Create_Product';

dotenv.config();

const router_mutate_product: Router = express.Router();
const handle_create_product_code = new Handle_Create_Product_Code();
const handle_create_product = new Handle_Create_Product();

router_mutate_product.post(
    '/create_product_code',
    authentication,
    handle_create_product_code.setup,
    handle_create_product_code.main
);

router_mutate_product.post('/create_product', authentication, handle_create_product.setup, handle_create_product.main);

export default router_mutate_product;

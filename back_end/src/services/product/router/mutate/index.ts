import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Product_Code from './handle/Create_Product_Code';

dotenv.config();

const router_mutate_product: Router = express.Router();
const handle_create_product_code = new Handle_Create_Product_Code();

router_mutate_product.post(
    '/create_product_code',
    authentication,
    handle_create_product_code.setup,
    handle_create_product_code.main
);

export default router_mutate_product;

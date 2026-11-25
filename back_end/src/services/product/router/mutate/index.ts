import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Product_Code from './handle/Create_Product_Code';
import Handle_Create_Product from './handle/Create_Product';
import Handle_Edit_Product from './handle/Edit_Product';
import Handle_Delete_Product from './handle/Delete_Product';
import Handle_Re_Delete_Product from './handle/Re_Delete_Product';

dotenv.config();

const router_mutate_product: Router = express.Router();
const handle_create_product_code = new Handle_Create_Product_Code();
const handle_create_product = new Handle_Create_Product();
const handle_edit_product = new Handle_Edit_Product();
const handle_delete_product = new Handle_Delete_Product();
const handle_re_delete_product = new Handle_Re_Delete_Product();

router_mutate_product.post(
    '/create_product_code',
    authentication,
    handle_create_product_code.setup,
    handle_create_product_code.main
);

router_mutate_product.post('/create_product', authentication, handle_create_product.setup, handle_create_product.main);

router_mutate_product.post('/edit_product', authentication, handle_edit_product.setup, handle_edit_product.main);

router_mutate_product.post('/delete_product', authentication, handle_delete_product.setup, handle_delete_product.main);

router_mutate_product.post(
    '/re_delete_product',
    authentication,
    handle_re_delete_product.setup,
    handle_re_delete_product.main
);

export default router_mutate_product;

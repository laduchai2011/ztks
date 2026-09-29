import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Shop from './handle/Create_Shop';
import Handle_Create_Depot from './handle/Create_Depot';
import Handle_Create_Store from './handle/Create_Store';

dotenv.config();

const router_mutate_shop: Router = express.Router();

const handle_create_shop = new Handle_Create_Shop();
const handle_create_depot = new Handle_Create_Depot();
const handle_create_store = new Handle_Create_Store();

router_mutate_shop.post('/create_shop', authentication, handle_create_shop.setup, handle_create_shop.main);

router_mutate_shop.post('/create_depot', authentication, handle_create_depot.setup, handle_create_depot.main);

router_mutate_shop.post('/create_store', authentication, handle_create_store.setup, handle_create_store.main);

export default router_mutate_shop;

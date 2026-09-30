import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Shop from './handle/Create_Shop';
import Handle_Create_Depot from './handle/Create_Depot';
import Handle_Create_Store from './handle/Create_Store';
import Handle_Edit_Shop from './handle/Edit_Shop';
import Handle_Edit_Depot from './handle/Edit_Depot';
import Handle_Edit_Store from './handle/Edit_Store';
import Handle_Delete_Shop from './handle/Delete_Shop';
import Handle_Delete_Depot from './handle/Delete_Depot';
import Handle_Delete_Store from './handle/Delete_Store';

dotenv.config();

const router_mutate_shop: Router = express.Router();

const handle_create_shop = new Handle_Create_Shop();
const handle_create_depot = new Handle_Create_Depot();
const handle_create_store = new Handle_Create_Store();
const handle_edit_shop = new Handle_Edit_Shop();
const handle_edit_depot = new Handle_Edit_Depot();
const handle_edit_store = new Handle_Edit_Store();
const handle_delete_shop = new Handle_Delete_Shop();
const handle_delete_depot = new Handle_Delete_Depot();
const handle_delete_store = new Handle_Delete_Store();

router_mutate_shop.post('/create_shop', authentication, handle_create_shop.setup, handle_create_shop.main);

router_mutate_shop.post('/create_depot', authentication, handle_create_depot.setup, handle_create_depot.main);

router_mutate_shop.post('/create_store', authentication, handle_create_store.setup, handle_create_store.main);

router_mutate_shop.post('/edit_shop', authentication, handle_edit_shop.setup, handle_edit_shop.main);

router_mutate_shop.post('/edit_depot', authentication, handle_edit_depot.setup, handle_edit_depot.main);

router_mutate_shop.post('/edit_store', authentication, handle_edit_store.setup, handle_edit_store.main);

router_mutate_shop.post('/delete_shop', authentication, handle_delete_shop.setup, handle_delete_shop.main);

router_mutate_shop.post('/delete_depot', authentication, handle_delete_depot.setup, handle_delete_depot.main);

router_mutate_shop.post('/delete_store', authentication, handle_delete_store.setup, handle_delete_store.main);

export default router_mutate_shop;

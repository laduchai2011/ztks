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
import Handle_Admin_Set_Shop_Role_For_One_Account from './handle/Admin_Set_Shop_Role_For_One_Account';
import Handle_Admin_Set_Shop_Role_For_One_Team from './handle/Admin_Set_Shop_Role_For_One_Team';
import Handle_Leader_Set_Shop_Role_For_One_Account from './handle/Leader_Set_Shop_Role_For_One_Account';
import Handle_Leader_Set_Shop_Role_For_One_Team from './handle/Leader_Set_Shop_Role_For_One_Team';

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
const handle_admin_set_shop_role_for_one_account = new Handle_Admin_Set_Shop_Role_For_One_Account();
const handle_admin_set_shop_role_for_one_team = new Handle_Admin_Set_Shop_Role_For_One_Team();
const handle_leader_set_shop_role_for_one_account = new Handle_Leader_Set_Shop_Role_For_One_Account();
const handle_leader_set_shop_role_for_one_team = new Handle_Leader_Set_Shop_Role_For_One_Team();

router_mutate_shop.post('/create_shop', authentication, handle_create_shop.setup, handle_create_shop.main);

router_mutate_shop.post('/create_depot', authentication, handle_create_depot.setup, handle_create_depot.main);

router_mutate_shop.post('/create_store', authentication, handle_create_store.setup, handle_create_store.main);

router_mutate_shop.post('/edit_shop', authentication, handle_edit_shop.setup, handle_edit_shop.main);

router_mutate_shop.post('/edit_depot', authentication, handle_edit_depot.setup, handle_edit_depot.main);

router_mutate_shop.post('/edit_store', authentication, handle_edit_store.setup, handle_edit_store.main);

router_mutate_shop.post('/delete_shop', authentication, handle_delete_shop.setup, handle_delete_shop.main);

router_mutate_shop.post('/delete_depot', authentication, handle_delete_depot.setup, handle_delete_depot.main);

router_mutate_shop.post('/delete_store', authentication, handle_delete_store.setup, handle_delete_store.main);

router_mutate_shop.post(
    '/admin_set_shop_role_for_one_account',
    authentication,
    handle_admin_set_shop_role_for_one_account.setup,
    handle_admin_set_shop_role_for_one_account.main
);

router_mutate_shop.post(
    '/admin_set_shop_role_for_one_team',
    authentication,
    handle_admin_set_shop_role_for_one_team.setup,
    handle_admin_set_shop_role_for_one_team.main
);

router_mutate_shop.post(
    '/leader_set_shop_role_for_one_account',
    authentication,
    handle_leader_set_shop_role_for_one_account.setup,
    handle_leader_set_shop_role_for_one_account.main
);

router_mutate_shop.post(
    '/leader_set_shop_role_for_one_team',
    authentication,
    handle_leader_set_shop_role_for_one_team.setup,
    handle_leader_set_shop_role_for_one_team.main
);

export default router_mutate_shop;

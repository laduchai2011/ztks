import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Shop_By_Id from './handle/Get_Shop_By_Id';
import Handle_Get_Depot_By_Id from './handle/Get_Depot_By_Id';
import Handle_Get_Store_By_Id from './handle/Get_Store_By_Id';
import Handle_Get_My_Shops from './handle/Get_My_Shops';
import Handle_Get_My_Depots from './handle/Get_My_Depots';
import Handle_Get_My_Stores from './handle/Get_My_Stores';
import Handle_Get_Latest_Shop_Pay_With_Shop_Id from './handle/Get_Latest_Shop_Pay_With_Shop_Id';
import Handle_Get_Shop_Role_Statistics_For_One_Team from './handle/Get_Shop_Role_Statistics_For_One_Team';
import Handle_Get_Shop_Role_For_One_Account from './handle/Get_Shop_Role_For_One_Account';
import Handle_Get_Depot_Role_Statistics_For_One_Team from './handle/Get_Depot_Role_Statistics_For_One_Team';
import Handle_Get_Depot_Role_For_One_Account from './handle/Get_Depot_Role_For_One_Account';
import Handle_Get_Team_Shops from './handle/Get_Team_Shops';
import Handle_Get_Team_Shop_Depots from './handle/Get_Team_Shop_Depots';
import Handle_Get_Team_Shop_Depot_Stores from './handle/Get_Team_Shop_Depot_Stores';

dotenv.config();
const router_query_shop: Router = express.Router();

const handle_get_shop_by_id = new Handle_Get_Shop_By_Id();
const handle_get_depot_by_id = new Handle_Get_Depot_By_Id();
const handle_get_store_by_id = new Handle_Get_Store_By_Id();
const handle_get_my_shops = new Handle_Get_My_Shops();
const handle_get_my_depots = new Handle_Get_My_Depots();
const handle_get_my_stores = new Handle_Get_My_Stores();
const handle_get_latest_shop_pay_with_shop_id = new Handle_Get_Latest_Shop_Pay_With_Shop_Id();
const handle_get_shop_role_statistics_for_one_team = new Handle_Get_Shop_Role_Statistics_For_One_Team();
const handle_get_shop_role_for_one_account = new Handle_Get_Shop_Role_For_One_Account();
const handle_get_depot_role_statistics_for_one_team = new Handle_Get_Depot_Role_Statistics_For_One_Team();
const handle_get_depot_role_for_one_account = new Handle_Get_Depot_Role_For_One_Account();
const handle_get_team_shops = new Handle_Get_Team_Shops();
const handle_get_team_shop_depots = new Handle_Get_Team_Shop_Depots();
const handle_get_team_shop_depot_stores = new Handle_Get_Team_Shop_Depot_Stores();

router_query_shop.post('/get_shop_by_id', handle_get_shop_by_id.main);

router_query_shop.post('/get_depot_by_id', handle_get_depot_by_id.main);

router_query_shop.post('/get_store_by_id', handle_get_store_by_id.main);

router_query_shop.post('/get_my_shops', handle_get_my_shops.main);

router_query_shop.post('/get_my_depots', handle_get_my_depots.main);

router_query_shop.post('/get_my_stores', handle_get_my_stores.main);

router_query_shop.post('/get_latest_shop_pay_with_shop_id', handle_get_latest_shop_pay_with_shop_id.main);

router_query_shop.post('/get_shop_role_statistics_for_one_team', handle_get_shop_role_statistics_for_one_team.main);

router_query_shop.post('/get_shop_role_for_one_account', handle_get_shop_role_for_one_account.main);

router_query_shop.post('/get_depot_role_statistics_for_one_team', handle_get_depot_role_statistics_for_one_team.main);

router_query_shop.post('/get_depot_role_for_one_account', handle_get_depot_role_for_one_account.main);

router_query_shop.post('/get_team_shops', handle_get_team_shops.main);

router_query_shop.post('/get_team_shop_depots', handle_get_team_shop_depots.main);

router_query_shop.post('/get_team_shop_depot_stores', handle_get_team_shop_depot_stores.main);

export default router_query_shop;

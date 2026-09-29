import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_My_Shops from './handle/Get_My_Shops';
import Handle_Get_My_Depots from './handle/Get_My_Depots';
import Handle_Get_My_Stores from './handle/Get_My_Stores';
import Handle_Get_Latest_Shop_Pay_With_Shop_Id from './handle/Get_Latest_Shop_Pay_With_Shop_Id';

dotenv.config();
const router_query_shop: Router = express.Router();

const handle_get_my_shops = new Handle_Get_My_Shops();
const handle_get_my_depots = new Handle_Get_My_Depots();
const handle_get_my_stores = new Handle_Get_My_Stores();
const handle_get_latest_shop_pay_with_shop_id = new Handle_Get_Latest_Shop_Pay_With_Shop_Id();

router_query_shop.post('/get_my_shops', handle_get_my_shops.main);

router_query_shop.post('/get_my_depots', handle_get_my_depots.main);

router_query_shop.post('/get_my_stores', handle_get_my_stores.main);

router_query_shop.post('/get_latest_shop_pay_with_shop_id', handle_get_latest_shop_pay_with_shop_id.main);

export default router_query_shop;

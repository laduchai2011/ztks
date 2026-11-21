import express, { Router } from 'express';
import dotenv from 'dotenv';
// import authentication from '@src/auth';
import Handle_Product_Code_Search from './handle/Product_Code_Search';
import Handle_Get_Product_Code_By_Id from './handle/Get_Product_Code_By_Id';
import Handle_Get_Product_Code_Total from './handle/Get_Product_Code_Total';
import Handle_Get_Product_Total from './handle/Get_Product_Total';

dotenv.config();

const router_query_product: Router = express.Router();
const handle_product_code_search = new Handle_Product_Code_Search();
const handle_get_product_code_by_id = new Handle_Get_Product_Code_By_Id();
const handle_get_product_code_total = new Handle_Get_Product_Code_Total();
const handle_get_product_total = new Handle_Get_Product_Total();

router_query_product.post('/product_code_search', handle_product_code_search.main);

router_query_product.post('/get_product_code_by_id', handle_get_product_code_by_id.main);

router_query_product.post('/get_product_code_total', handle_get_product_code_total.main);

router_query_product.post('/get_product_total', handle_get_product_total.main);

export default router_query_product;

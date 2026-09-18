import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Statistics_Oa from './handle/Get_Statistics_Oa';

dotenv.config();
const router_query_statistics: Router = express.Router();

const handle_get_statistics_oa = new Handle_Get_Statistics_Oa();

router_query_statistics.post('/get_statistics_oa', handle_get_statistics_oa.main);

export default router_query_statistics;

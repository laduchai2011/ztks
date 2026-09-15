import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_GetStatisticsOa from './handle/GetStatisticsOa';

dotenv.config();
const router_query_statistics: Router = express.Router();

const handle_getStatisticsOa = new Handle_GetStatisticsOa();

router_query_statistics.post('/getStatisticsOa', handle_getStatisticsOa.main);

export default router_query_statistics;

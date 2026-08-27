import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_GetStatistics from './handle/GetStatistics';

dotenv.config();
const router_query_statistics: Router = express.Router();

const handle_getStatistics = new Handle_GetStatistics();

router_query_statistics.post('/getStatistics', handle_getStatistics.main);

export default router_query_statistics;

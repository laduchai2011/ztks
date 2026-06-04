import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetMccInfo from './handle/GetMccInfo';

dotenv.config();

const router_query_call: Router = express.Router();
const handle_getMccInfo = new Handle_GetMccInfo();

router_query_call.post('/getMccInfo', authentication, handle_getMccInfo.setup, handle_getMccInfo.main);

export default router_query_call;

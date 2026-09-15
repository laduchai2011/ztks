import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_GetMccInfo from './handle/GetMccInfo';
import Handle_CheckConsent from './CheckConsent';

dotenv.config();

const router_query_call: Router = express.Router();
const handle_getMccInfo = new Handle_GetMccInfo();
const handle_checkConsent = new Handle_CheckConsent();

router_query_call.post('/getMccInfo', authentication, handle_getMccInfo.setup, handle_getMccInfo.main);

router_query_call.post('/checkConsent', authentication, handle_checkConsent.setup, handle_checkConsent.main);

export default router_query_call;
